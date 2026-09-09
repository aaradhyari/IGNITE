import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

/* 3D interactive observatory dial — Three.js, no extra deps.
   Drag to spin · hover nodes to inspect · click a node to jump to events. */

const CLUSTERS = [
  { id: '01', label: 'INNOVATION', sub: 'IMAGINATION · VENTURE', color: '#FFB800', ring: 0, speed: 0.32, offset: 0.0 },
  { id: '02', label: 'IT & LOGIC', sub: 'COMPUTATION · SYSTEMS', color: '#5B8CFF', ring: 1, speed: -0.24, offset: 1.7 },
  { id: '03', label: 'PHOTOGRAPHY', sub: 'PERSPECTIVE · VISION', color: '#E8E8E8', ring: 1, speed: -0.24, offset: 4.6 },
  { id: '04', label: 'ROBOTICS', sub: 'ENGINEERING · TORQUE', color: '#FF5C5C', ring: 2, speed: 0.18, offset: 3.1 },
]

const RINGS = [
  { radius: 1.15, tilt: 1.25, color: '#8a6a2a', opacity: 0.55 },
  { radius: 1.75, tilt: 1.32, color: '#3a4552', opacity: 0.55 },
  { radius: 2.35, tilt: 1.18, color: '#333e4b', opacity: 0.42 },
]

function makeGlowTexture(hex) {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, hex)
  g.addColorStop(0.35, hex + 'AA')
  g.addColorStop(1, hex + '00')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const tex = new THREE.CanvasTexture(c)
  tex.needsUpdate = true
  return tex
}

export default function HeroVisual({ className = '' }) {
  const mountRef = useRef(null)
  const labelRefs = useRef([])
  const [flux, setFlux] = useState(42)
  const [hovered, setHovered] = useState(null)
  const [failed, setFailed] = useState(false)
  const hoveredRef = useRef(null)

  const reducedMotion = useMemo(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  useEffect(() => {
    if (reducedMotion) return
    const id = setInterval(() => setFlux((f) => (f >= 99 ? 12 : f + 1)), 500)
    return () => clearInterval(id)
  }, [reducedMotion])

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
      if (!renderer.getContext()) throw new Error('no webgl')
    } catch {
      setFailed(true)
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.cursor = 'grab'
    mount.appendChild(renderer.domElement)
    const dom = renderer.domElement

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x07090d, 0.022)
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
    camera.position.set(0, 0.8, 7.6)

    scene.add(new THREE.AmbientLight(0x364052, 0.85))
    const keyLight = new THREE.DirectionalLight(0xffe0b3, 1.4)
    keyLight.position.set(4, 5, 6)
    scene.add(keyLight)
    const amberLight = new THREE.PointLight(0xffb800, 14, 14, 2)
    amberLight.position.set(0, 0.4, 0.8)
    scene.add(amberLight)
    const rim = new THREE.DirectionalLight(0x5b8cff, 1.6)
    rim.position.set(-6, -2, -5)
    scene.add(rim)

    const dial = new THREE.Group()
    dial.rotation.x = 0.12
    scene.add(dial)

    const disposables = []
    const track = (obj) => {
      disposables.push(obj)
      return obj
    }

    // --- Core: dark metallic orb with a hot amber heart ---
    const core = new THREE.Mesh(
      track(new THREE.SphereGeometry(0.2, 48, 48)),
      track(
        new THREE.MeshStandardMaterial({
          color: '#141a22',
          metalness: 0.9,
          roughness: 0.32,
          emissive: '#FFB800',
          emissiveIntensity: 0.5,
        })
      )
    )
    dial.add(core)
    const cage = new THREE.Mesh(
      track(new THREE.IcosahedronGeometry(0.34, 1)),
      track(new THREE.MeshBasicMaterial({ color: '#8a6a2a', wireframe: true, transparent: true, opacity: 0.26 }))
    )
    dial.add(cage)
    const amberGlowTex = track(makeGlowTexture('#FFB800'))
    const halo = new THREE.Sprite(
      track(new THREE.SpriteMaterial({ map: amberGlowTex, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false }))
    )
    halo.scale.setScalar(1.1)
    dial.add(halo)

    // --- Rings + pivots ---
    const pivots = RINGS.map((r) => {
      const pivot = new THREE.Group()
      pivot.rotation.x = r.tilt
      dial.add(pivot)
      const ring = new THREE.Mesh(
        track(new THREE.TorusGeometry(r.radius, 0.0045, 12, 220)),
        track(new THREE.MeshBasicMaterial({ color: r.color, transparent: true, opacity: r.opacity }))
      )
      ring.rotation.x = Math.PI / 2
      pivot.add(ring)
      return pivot
    })

    // --- Satellites ---
    const sats = CLUSTERS.map((c) => {
      const pivot = pivots[c.ring]
      const holder = new THREE.Group()
      pivot.add(holder)
      const mesh = new THREE.Mesh(
        track(new THREE.SphereGeometry(0.07, 32, 32)),
        track(
          new THREE.MeshStandardMaterial({
            color: c.color,
            metalness: 0.85,
            roughness: 0.3,
            emissive: c.color,
            emissiveIntensity: 0.22,
          })
        )
      )
      const glowTex = track(makeGlowTexture(c.color))
      const glow = new THREE.Sprite(
        track(new THREE.SpriteMaterial({ map: glowTex, transparent: true, opacity: 0.42, blending: THREE.AdditiveBlending, depthWrite: false }))
      )
      glow.scale.setScalar(0.38)
      holder.add(mesh, glow)
      holder.position.set(RINGS[c.ring].radius, 0, 0)
      mesh.userData.cluster = c
      return { ...c, holder, mesh, glow, angle: c.offset }
    })

    // --- Starfield ---
    const starGeo = track(new THREE.BufferGeometry())
    {
      const N = 420
      const pos = new Float32Array(N * 3)
      const col = new Float32Array(N * 3)
      const base = new THREE.Color('#94A3B8')
      const gold = new THREE.Color('#FFD166')
      for (let i = 0; i < N; i++) {
        const u = Math.random()
        const v = Math.random()
        const theta = u * Math.PI * 2
        const phi = Math.acos(2 * v - 1)
        const r = 11 + Math.random() * 9
        pos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
        pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
        pos[i * 3 + 2] = r * Math.cos(phi)
        const cc = Math.random() < 0.12 ? gold : base
        const b = 0.35 + Math.random() * 0.65
        col[i * 3] = cc.r * b
        col[i * 3 + 1] = cc.g * b
        col[i * 3 + 2] = cc.b * b
      }
      starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      starGeo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    }
    const stars = new THREE.Points(
      starGeo,
      track(new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.55, depthWrite: false }))
    )
    scene.add(stars)

    // --- Layout ---
    function layout() {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
      dial.scale.setScalar(w < 640 ? 0.82 : 1)
    }
    layout()

    // --- Interaction state ---
    let targetRotY = 0.5
    let rotY = 0.5
    let targetTiltX = 0
    let tiltX = 0
    let dragging = false
    let lastX = 0
    let lastY = 0
    const pointerNDC = new THREE.Vector2(-10, -10)
    let downPos = null
    const raycaster = new THREE.Raycaster()
    const tmpV = new THREE.Vector3()

    function setPointer(e) {
      const rect = mount.getBoundingClientRect()
      pointerNDC.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      pointerNDC.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
    }

    function onDown(e) {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      downPos = { x: e.clientX, y: e.clientY }
      dom.style.cursor = 'grabbing'
      dom.setPointerCapture?.(e.pointerId)
    }
    function onMove(e) {
      setPointer(e)
      if (!dragging) return
      targetRotY += (e.clientX - lastX) * 0.006
      targetTiltX = THREE.MathUtils.clamp(targetTiltX + (e.clientY - lastY) * 0.003, -0.5, 0.6)
      lastX = e.clientX
      lastY = e.clientY
    }
    function onUp(e) {
      dragging = false
      dom.style.cursor = 'grab'
      // Click (not drag) on a node → jump to events
      if (downPos && Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) < 6 && hoveredRef.current) {
        document.getElementById('events')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      downPos = null
    }

    dom.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    function onResize() {
      layout()
    }
    window.addEventListener('resize', onResize)
    const ro = new ResizeObserver(layout)
    ro.observe(mount)

    const clock = new THREE.Clock()
    let raf = 0

    function projectToScreen(obj, el) {
      obj.getWorldPosition(tmpV).project(camera)
      const rect = mount.getBoundingClientRect()
      const x = ((tmpV.x + 1) / 2) * rect.width
      const y = ((-tmpV.y + 1) / 2) * rect.height
      el.style.transform = `translate(-50%, -130%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`
      el.style.opacity = tmpV.z < 1 ? '1' : '0'
    }

    function animate() {
      raf = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      if (!reducedMotion && !dragging) targetRotY += dt * 0.12
      rotY += (targetRotY - rotY) * Math.min(dt * 4, 1)
      tiltX += (targetTiltX - tiltX) * Math.min(dt * 4, 1)
      dial.rotation.y = rotY
      dial.rotation.x = 0.12 + tiltX
      if (!reducedMotion) {
        cage.rotation.y = t * 0.5
        cage.rotation.x = t * 0.22
        halo.material.opacity = 0.42 + Math.sin(t * 2.2) * 0.08
        stars.rotation.y = t * 0.004
      }

      // Satellites along their rings
      if (!reducedMotion) {
        for (const s of sats) {
          s.angle += dt * s.speed
          s.holder.position.set(Math.cos(s.angle) * RINGS[s.ring].radius, 0, Math.sin(s.angle) * RINGS[s.ring].radius)
        }
      } else {
        for (const s of sats) {
          s.holder.position.set(Math.cos(s.angle) * RINGS[s.ring].radius, 0, Math.sin(s.angle) * RINGS[s.ring].radius)
        }
      }

      // Hover highlight (raycast each frame — only 4 targets)
      raycaster.setFromCamera(pointerNDC, camera)
      const hits = raycaster.intersectObjects(sats.map((s) => s.mesh), false)
      const hitId = hits.length ? hits[0].object.userData.cluster.id : null
      if (hitId !== hoveredRef.current) {
        hoveredRef.current = hitId
        setHovered(hitId)
        dom.style.cursor = hitId ? 'pointer' : dragging ? 'grabbing' : 'grab'
      }
      for (const s of sats) {
        const active = s.id === hoveredRef.current
        const target = active ? 1.35 : 1
        s.mesh.scale.setScalar(s.mesh.scale.x + (target - s.mesh.scale.x) * 0.2)
        s.glow.material.opacity = active ? 0.75 : 0.42
      }

      // Project labels
      sats.forEach((s, i) => {
        const el = labelRefs.current[i]
        if (el) projectToScreen(s.mesh, el)
      })

      // Gentle camera parallax from pointer
      camera.position.x += (pointerNDC.x * 0.5 - camera.position.x) * Math.min(dt * 2, 1)
      camera.position.y += ((0.7 - pointerNDC.y * 0.35) - camera.position.y) * Math.min(dt * 2, 1)
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', onResize)
      ro.disconnect()
      dom.removeEventListener('pointerdown', onDown)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => {
            if (m.map) m.map.dispose()
            m.dispose()
          })
        }
      })
      renderer.dispose()
      if (dom.parentNode === mount) mount.removeChild(dom)
    }
  }, [reducedMotion])

  if (failed) {
    return (
      <div className={`relative flex items-center justify-center ${className}`} role="img" aria-label="Observatory dial">
        <div className="relative h-64 w-64">
          <div className="absolute inset-0 rounded-full border border-charcoal" />
          <div className="absolute inset-10 rounded-full border border-dashed border-amber/40" />
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber shadow-[0_0_24px_8px_rgba(255,184,0,0.5)]" />
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`} role="img" aria-label="Interactive 3D observatory dial — drag to spin, click a cluster to view events">
      {/* Ambient glow behind canvas */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: 'radial-gradient(420px 320px at 50% 50%, rgba(255,184,0,0.1), transparent 65%), radial-gradient(560px 420px at 50% 58%, rgba(91,140,255,0.07), transparent 65%)' }}
      />
      <div ref={mountRef} className="absolute inset-0" />

      {/* 3D-anchored cluster labels */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {CLUSTERS.map((c, i) => (
          <div
            key={c.id}
            ref={(el) => {
              labelRefs.current[i] = el
            }}
            className="absolute left-0 top-0"
            style={{ opacity: 0 }}
          >
            <div
              className={`flex items-center gap-2 border px-2.5 py-1.5 backdrop-blur-sm transition-colors ${
                hovered === c.id ? 'border-amber bg-midnight/90' : 'border-charcoal/80 bg-midnight/70'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
              <span className="num-tech text-[9px] tracking-[0.16em] text-ice">
                {c.id} // {c.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* HUD */}
      <div className="absolute left-4 top-16 hidden items-center gap-2 border border-charcoal/80 bg-midnight/70 px-3 py-1.5 backdrop-blur-sm sm:flex lg:left-8">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" />
        <span className="num-tech text-[10px] tracking-[0.18em] text-ice">DIAL // 3D</span>
        <span className="num-tech text-[10px] text-slate">FLUX {String(flux).padStart(3, '0')}%</span>
      </div>
      <p className="num-tech absolute bottom-6 right-6 hidden text-[9px] tracking-[0.22em] text-slate/80 md:block" aria-hidden="true">
        DRAG TO SPIN · CLICK NODE — 22.72°N 75.86°E
      </p>
    </div>
  )
}
