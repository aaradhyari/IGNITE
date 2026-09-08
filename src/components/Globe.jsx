import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'

/* ============================================================
   IGNITE — DIGITAL EARTH
   A scientific data-visualization globe built from thousands of
   points. Continents are derived from a lightweight procedural
   land-mask (metaball seeds) so the build needs no external image
   assets. India is oriented to face the viewer and the Indore
   marker is attached to the rotating globe by spherical geometry.
   ============================================================ */

const R = 1 // globe radius (world units)
const IND_LAT = 22.7196
const IND_LNG = 75.8577

// ---- Procedural land mask: lat/lng metaball seeds (degrees) ----
const LAND = [
  // North America
  { lat: 55, lng: -100, r: 20 }, { lat: 48, lng: -95, r: 15 },
  { lat: 40, lng: -98, r: 12 }, { lat: 32, lng: -103, r: 9 },
  { lat: 25, lng: -102, r: 6 }, { lat: 60, lng: -110, r: 14 },
  { lat: 62, lng: -75, r: 10 }, { lat: 70, lng: -82, r: 11 },
  // Greenland
  { lat: 72, lng: -42, r: 9 },
  // South America
  { lat: 0, lng: -62, r: 15 }, { lat: -12, lng: -60, r: 13 },
  { lat: -25, lng: -58, r: 10 }, { lat: -35, lng: -62, r: 7 },
  { lat: -45, lng: -70, r: 5 },
  // Europe
  { lat: 52, lng: 15, r: 11 }, { lat: 58, lng: 22, r: 9 },
  { lat: 47, lng: 8, r: 8 }, { lat: 60, lng: 12, r: 9 },
  // Africa
  { lat: 28, lng: 12, r: 13 }, { lat: 10, lng: 20, r: 15 },
  { lat: 0, lng: 22, r: 14 }, { lat: -12, lng: 25, r: 14 },
  { lat: -25, lng: 26, r: 9 }, { lat: -33, lng: 24, r: 6 },
  // Arabia
  { lat: 24, lng: 46, r: 9 },
  // Asia
  { lat: 58, lng: 95, r: 20 }, { lat: 50, lng: 100, r: 18 },
  { lat: 40, lng: 100, r: 16 }, { lat: 33, lng: 105, r: 13 },
  { lat: 62, lng: 120, r: 15 }, { lat: 55, lng: 135, r: 10 },
  { lat: 38, lng: 140, r: 5 }, // Japan
  // India (distinct peninsula)
  { lat: 28, lng: 78, r: 7 }, { lat: 24, lng: 79, r: 9 },
  { lat: 20, lng: 78, r: 8 }, { lat: 16, lng: 78, r: 7 },
  { lat: 11, lng: 77, r: 6 }, { lat: 8, lng: 77, r: 5 },
  // SE Asia
  { lat: 5, lng: 108, r: 8 }, { lat: 12, lng: 104, r: 6 },
  { lat: -2, lng: 114, r: 9 },
  // Australia
  { lat: -25, lng: 134, r: 13 }, { lat: -30, lng: 120, r: 8 },
  { lat: -20, lng: 145, r: 7 },
]

function hashNoise(a, b) {
  return (
    Math.sin(a * 0.7 + b * 0.3) +
    Math.sin(a * 0.21 - b * 0.13) +
    Math.sin((a + b) * 0.05)
  ) / 3
}

function isLand(lat, lng) {
  const latR = (lat * Math.PI) / 180
  const n = hashNoise(lat, lng)
  for (let i = 0; i < LAND.length; i++) {
    const s = LAND[i]
    const dLat = lat - s.lat
    const dLng = (lng - s.lng) * Math.cos(latR)
    const d = Math.sqrt(dLat * dLat + dLng * dLng)
    if (d < s.r * (1 + 0.16 * n)) return true
  }
  return false
}

function latLngToVec3(lat, lng, radius) {
  const phi = ((90 - lat) * Math.PI) / 180
  const theta = ((lng + 180) * Math.PI) / 180
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  )
}

// Soft round sprite used for stars + earth points
function makeDiscTexture() {
  const size = 64
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  )
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.4, 'rgba(255,255,255,0.85)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

function makeGlowTexture(color) {
  const size = 128
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(
    size / 2, size / 2, 0,
    size / 2, size / 2, size / 2,
  )
  g.addColorStop(0, color)
  g.addColorStop(0.25, color.replace('1)', '0.5)'))
  g.addColorStop(1, color.replace('1)', '0)'))
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

export default function Globe({ className = '' }) {
  const mountRef = useRef(null)
  const labelRef = useRef(null)
  const lineRef = useRef(null)
  const dotRef = useRef(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
      const ctx = renderer.getContext()
      if (!ctx) throw new Error('no webgl')
    } catch (e) {
      setFailed(true)
      return
    }

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const discTex = makeDiscTexture()
    const amberGlow = makeGlowTexture('rgba(255,184,0,1)')

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 200)
    camera.position.set(0, 0, 7)

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'

    // ---------------------------------------------------------
    // Globe group (everything that rotates together)
    // ---------------------------------------------------------
    const globe = new THREE.Group()
    scene.add(globe)

    const isMobile = window.innerWidth < 768

    // ---- Earth points (continents) ----
    const COUNT = isMobile ? 7000 : 16000
    const positions = []
    const colors = []
    const cPrimary = new THREE.Color('#F5F7FA')
    const cSecondary = new THREE.Color('#A7B0BC')
    // Fibonacci sphere distribution
    const goldenAngle = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2
      const radiusAtY = Math.sqrt(1 - y * y)
      const theta = goldenAngle * i
      const x = Math.cos(theta) * radiusAtY
      const z = Math.sin(theta) * radiusAtY
      // to lat/lng
      const lat = Math.asin(y) * (180 / Math.PI)
      const lng = Math.atan2(z, x) * (180 / Math.PI)
      if (!isLand(lat, lng)) continue
      positions.push(x * R, y * R, z * R)
      const c = Math.random() < 0.72 ? cPrimary : cSecondary
      const b = 0.78 + Math.random() * 0.22
      colors.push(c.r * b, c.g * b, c.b * b)
    }

    const earthGeo = new THREE.BufferGeometry()
    earthGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3),
    )
    earthGeo.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(colors, 3),
    )
    const earthMat = new THREE.PointsMaterial({
      size: isMobile ? 0.018 : 0.022,
      map: discTex,
      vertexColors: true,
      transparent: true,
      alphaTest: 0.05,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const earthPoints = new THREE.Points(earthGeo, earthMat)
    globe.add(earthPoints)

    // ---- Lat / Long grid (subtle digital cartography) ----
    const gridPts = []
    const SEG = 64
    for (let m = 0; m < 24; m++) {
      const lng = (m / 24) * 360 - 180
      for (let i = 0; i < SEG; i++) {
        const a = (i / SEG) * Math.PI * 2
        const b = ((i + 1) / SEG) * Math.PI * 2
        // build meridian by rotating around Y
        const v1 = new THREE.Vector3(
          Math.cos(a) * R * 0.999,
          0,
          Math.sin(a) * R * 0.999,
        ).applyAxisAngle(new THREE.Vector3(0, 1, 0), (lng * Math.PI) / 180)
        const v2 = new THREE.Vector3(
          Math.cos(b) * R * 0.999,
          0,
          Math.sin(b) * R * 0.999,
        ).applyAxisAngle(new THREE.Vector3(0, 1, 0), (lng * Math.PI) / 180)
        gridPts.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z)
      }
    }
    for (let p = -75; p <= 75; p += 15) {
      for (let i = 0; i < SEG; i++) {
        const a = (i / SEG) * Math.PI * 2
        const b = ((i + 1) / SEG) * Math.PI * 2
        const r = R * 0.999 * Math.cos((p * Math.PI) / 180)
        const y = R * 0.999 * Math.sin((p * Math.PI) / 180)
        const v1 = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r)
        const v2 = new THREE.Vector3(Math.cos(b) * r, y, Math.sin(b) * r)
        gridPts.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z)
      }
    }
    const gridGeo = new THREE.BufferGeometry()
    gridGeo.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(gridPts, 3),
    )
    const gridMat = new THREE.LineBasicMaterial({
      color: '#26303B',
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    })
    const grid = new THREE.LineSegments(gridGeo, gridMat)
    globe.add(grid)

    // ---- Atmosphere (restrained blue fresnel rim) ----
    const atmoGeo = new THREE.SphereGeometry(R * 1.07, 48, 48)
    const atmoMat = new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color('#5B8CFF') } },
      vertexShader: `
        varying vec3 vN;
        void main(){
          vN = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }`,
      fragmentShader: `
        varying vec3 vN;
        uniform vec3 uColor;
        void main(){
          float fres = pow(1.0 - abs(dot(vN, vec3(0.0,0.0,1.0))), 3.0);
          gl_FragColor = vec4(uColor, fres * 0.45);
        }`,
    })
    const atmo = new THREE.Mesh(atmoGeo, atmoMat)
    globe.add(atmo)

    // ---- Indore marker (geographically attached) ----
    const markerLocal = latLngToVec3(IND_LAT, IND_LNG, R * 1.012)
    const markerGroup = new THREE.Group()
    markerGroup.position.copy(markerLocal)
    // orient local +Z to radial direction
    const radial = markerLocal.clone().normalize()
    markerGroup.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      radial,
    )
    globe.add(markerGroup)

    // core point
    const coreGeo = new THREE.SphereGeometry(0.014, 14, 14)
    const coreMat = new THREE.MeshBasicMaterial({ color: '#FFB800' })
    const core = new THREE.Mesh(coreGeo, coreMat)
    markerGroup.add(core)

    // halo sprite
    const haloMat = new THREE.SpriteMaterial({
      map: amberGlow,
      color: '#FFB800',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const halo = new THREE.Sprite(haloMat)
    halo.scale.setScalar(0.22)
    markerGroup.add(halo)

    // pulse ring (lies in tangent plane = local XY)
    const ringGeo = new THREE.RingGeometry(0.022, 0.03, 40)
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#FFB800',
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    markerGroup.add(ring)

    // connection line + end tick — local +Z is the outward radial direction
    const lineStart = new THREE.Vector3(0, 0, R * 0.02)
    const lineEnd = new THREE.Vector3(0, 0, R * 0.5)
    const lineGeo = new THREE.BufferGeometry().setFromPoints([
      lineStart,
      lineEnd,
    ])
    const lineMat = new THREE.LineBasicMaterial({
      color: '#FFB800',
      transparent: true,
      opacity: 0.55,
    })
    const connLine = new THREE.Line(lineGeo, lineMat)
    markerGroup.add(connLine)

    const tickGeo = new THREE.SphereGeometry(0.01, 8, 8)
    const tick = new THREE.Mesh(tickGeo, coreMat)
    tick.position.copy(lineEnd)
    markerGroup.add(tick)

    // ---------------------------------------------------------
    // Star field — three layered depths
    // ---------------------------------------------------------
    function makeStars(count, radius, size, opacity, tint) {
      const pos = []
      const col = []
      const base = new THREE.Color(tint)
      for (let i = 0; i < count; i++) {
        // random direction on sphere of given radius
        const u = Math.random()
        const v = Math.random()
        const theta = u * Math.PI * 2
        const phi = Math.acos(2 * v - 1)
        const r = radius * (0.7 + Math.random() * 0.3)
        pos.push(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi),
        )
        const b = 0.5 + Math.random() * 0.5
        col.push(base.r * b, base.g * b, base.b * b)
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
      g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3))
      const m = new THREE.PointsMaterial({
        size,
        map: discTex,
        vertexColors: true,
        transparent: true,
        opacity,
        alphaTest: 0.02,
        depthWrite: false,
        sizeAttenuation: true,
      })
      return new THREE.Points(g, m)
    }

    const starsFar = makeStars(
      isMobile ? 600 : 1500, 60, isMobile ? 0.1 : 0.13, 0.4, '#A7B0BC',
    )
    const starsMid = makeStars(
      isMobile ? 350 : 800, 44, isMobile ? 0.16 : 0.2, 0.6, '#F5F7FA',
    )
    const starsNear = makeStars(
      isMobile ? 120 : 200, 30, isMobile ? 0.28 : 0.34, 0.85, '#F5F7FA',
    )
    scene.add(starsFar, starsMid, starsNear)

    // a few warm foreground stars for cosmic accent
    const warm = makeStars(
      isMobile ? 8 : 16, 28, isMobile ? 0.28 : 0.34, 0.9, '#FFD166',
    )
    scene.add(warm)

    // ---------------------------------------------------------
    // Orientation: bring Indore to face the camera (+Z)
    // ---------------------------------------------------------
    const indDir = latLngToVec3(IND_LAT, IND_LNG, 1).normalize()
    const frontDir = new THREE.Vector3(0, 0, 1)
    const baseQuat = new THREE.Quaternion().setFromUnitVectors(
      indDir,
      frontDir,
    )

    // ---------------------------------------------------------
    // Layout per breakpoint
    // ---------------------------------------------------------
    function layout() {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      const mobile = w < 768
      camera.aspect = w / h
      const halfW = (7 * Math.tan((35 * Math.PI) / 360)) * camera.aspect
      camera.position.z = 7
      globe.position.x = mobile ? 0.4 : 1.15
      globe.scale.setScalar(mobile ? 0.68 : 1)
      globe.position.y = mobile ? 0.05 : 0
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
      return { mobile, halfW }
    }
    let { mobile } = layout()

    // ---------------------------------------------------------
    // Interaction: drag + parallax
    // ---------------------------------------------------------
    let spin = 0
    let targetSpin = 0
    let tilt = 0
    let targetTilt = 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    let pointerX = 0
    let pointerY = 0
    const parallax = { x: 0, y: 0 }

    function onDown(e) {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
    }
    function onMove(e) {
      const rect = mount.getBoundingClientRect()
      const nx = (e.clientX - rect.left) / rect.width
      const ny = (e.clientY - rect.top) / rect.height
      pointerX = nx
      pointerY = ny
      if (dragging) {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        lastX = e.clientX
        lastY = e.clientY
        targetSpin += dx * 0.005
        targetTilt = THREE.MathUtils.clamp(
          targetTilt + dy * 0.004,
          -0.5,
          0.5,
        )
      }
    }
    function onUp() {
      dragging = false
    }
    function onLeave() {
      dragging = false
      pointerX = 0.5
      pointerY = 0.5
    }

    const dom = renderer.domElement
    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    dom.addEventListener('pointerleave', onLeave)

    // ---------------------------------------------------------
    // Annotation projection (HTML label + leader line)
    // ---------------------------------------------------------
    const tmpV = new THREE.Vector3()
    const tmpEnd = new THREE.Vector3()

    function projectToScreen(vec) {
      tmpV.copy(vec).project(camera)
      const rect = mount.getBoundingClientRect()
      return {
        x: ((tmpV.x + 1) / 2) * rect.width,
        y: ((-tmpV.y + 1) / 2) * rect.height,
        z: tmpV.z,
      }
    }

    // ---------------------------------------------------------
    // Animation loop
    // ---------------------------------------------------------
    let raf = 0
    let last = performance.now()

    function animate(now) {
      raf = requestAnimationFrame(animate)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now

      if (!reduceMotion && !dragging) {
        targetSpin += dt * 0.045 // very slow automatic rotation
      }
      // damping
      spin += (targetSpin - spin) * Math.min(dt * 3, 1)
      tilt += (targetTilt - tilt) * Math.min(dt * 3, 1)

      // compose orientation: align Indore front, then spin (world Y), then tilt
      const qSpin = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        spin,
      )
      const qTilt = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(1, 0, 0),
        tilt,
      )
      globe.quaternion
        .copy(baseQuat)
        .premultiply(qSpin)
        .premultiply(qTilt)

      // subtle parallax of camera toward pointer
      if (!reduceMotion) {
        parallax.x += (pointerX - 0.5 - parallax.x) * Math.min(dt * 2, 1)
        parallax.y += (0.5 - pointerY - parallax.y) * Math.min(dt * 2, 1)
      }
      camera.position.x = parallax.x * 0.5
      camera.position.y = parallax.y * 0.4
      camera.lookAt(0, 0, 0)

      // slow star drift
      if (!reduceMotion) {
        starsFar.rotation.y += dt * 0.005
        starsMid.rotation.y -= dt * 0.008
        starsNear.rotation.x += dt * 0.01
      }

      // marker pulse
      if (!reduceMotion) {
        const t = (now % 3000) / 3000
        const s = 0.6 + t * 1.9
        ring.scale.setScalar(s)
        ringMat.opacity = 0.8 * (1 - t)
        halo.material.opacity = 0.45 + 0.25 * Math.sin(now * 0.002)
      }

      renderer.render(scene, camera)

      // ---- update HTML annotation ----
      core.getWorldPosition(tmpV)
      tick.getWorldPosition(tmpEnd)
      // world-space outward normal of the marker (rotates with the globe)
      const worldNormal = radial.clone().applyQuaternion(globe.quaternion)
      const toCam = camera.position.clone().sub(tmpV)
      const facing = worldNormal.dot(toCam.normalize())
      const labelEl = labelRef.current
      const lineEl = lineRef.current
      const dotEl = dotRef.current
      const visible = facing > 0.05 && tmpV.z < 1
      if (labelEl && lineEl && dotEl) {
        if (!visible) {
          labelEl.style.opacity = '0'
          lineEl.style.opacity = '0'
          dotEl.style.opacity = '0'
        } else {
          const p = projectToScreen(tmpV)
          const e = projectToScreen(tmpEnd)
          labelEl.style.opacity = '1'
          lineEl.style.opacity = '1'
          dotEl.style.opacity = '1'
          dotEl.style.left = `${p.x}px`
          dotEl.style.top = `${p.y}px`
          // label floats to the upper-right of the line end
          const lx = e.x + 64
          const ly = e.y - 18
          labelEl.style.left = `${lx}px`
          labelEl.style.top = `${ly}px`
          // leader line from line-end to label anchor
          lineEl.setAttribute('x1', e.x)
          lineEl.setAttribute('y1', e.y)
          lineEl.setAttribute('x2', lx - 6)
          lineEl.setAttribute('y2', ly + 16)
        }
      }
    }
    raf = requestAnimationFrame(animate)

    // ---------------------------------------------------------
    // Resize
    // ---------------------------------------------------------
    function onResize() {
      const r = layout()
      mobile = r.mobile
    }
    window.addEventListener('resize', onResize)

    // ---------------------------------------------------------
    // Cleanup
    // ---------------------------------------------------------
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', onResize)
      dom.removeEventListener('pointerdown', onDown)
      dom.removeEventListener('pointerleave', onLeave)

      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material)
            ? obj.material
            : [obj.material]
          mats.forEach((m) => {
            if (m.map) m.map.dispose()
            m.dispose()
          })
        }
      })
      discTex.dispose()
      amberGlow.dispose()
      renderer.dispose()
      if (dom.parentNode) dom.parentNode.removeChild(dom)
    }
  }, [])

  if (failed) {
    // Graceful static fallback — the site remains usable without WebGL
    return (
      <div
        className={`relative flex items-center justify-center ${className}`}
        role="img"
        aria-label="IGNITE event location: Indore, Madhya Pradesh, India."
      >
        <div className="relative h-64 w-64 sm:h-80 sm:w-80">
          <div className="absolute inset-0 rounded-full border border-charcoal" />
          <div className="absolute inset-3 rounded-full border border-charcoal/60" />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, rgba(91,140,255,0.10), transparent 70%)',
            }}
          />
          <div className="absolute left-1/2 top-[42%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_24px_8px_rgba(255,184,0,0.5)]" />
          <div className="absolute left-[54%] top-[42%] -translate-y-1/2 text-left">
            <div className="font-display text-[10px] tracking-wide2 text-amber">
              INDORE
            </div>
            <div className="text-[9px] tracking-wide2 text-slate">
              MADHYA PRADESH • INDIA
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div ref={mountRef} className={`relative h-full w-full ${className}`}>
      {/* SVG leader line from marker to annotation */}
      <svg className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block">
        <line
          ref={lineRef}
          x1="0"
          y1="0"
          x2="0"
          y2="0"
          stroke="#FFB800"
          strokeWidth="1"
          strokeDasharray="2 3"
          opacity="0"
        />
      </svg>
      {/* marker anchor dot */}
      <div
        ref={dotRef}
        className="pointer-events-none absolute hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber sm:block"
        style={{ opacity: 0, boxShadow: '0 0 12px 3px rgba(255,184,0,0.6)' }}
      />
      {/* HTML annotation (updates each frame) */}
      <div
        ref={labelRef}
        className="pointer-events-none absolute hidden -translate-y-1/2 sm:block"
        style={{ opacity: 0, transition: 'opacity 0.4s ease' }}
      >
        <div className="border-l border-amber/70 pl-3">
          <div className="font-display text-xs tracking-wide2 text-amber sm:text-sm">
            INDORE
          </div>
          <div className="mt-0.5 text-[9px] tracking-wide2 text-slate sm:text-[10px]">
            MADHYA PRADESH • INDIA
          </div>
        </div>
      </div>
    </div>
  )
}
