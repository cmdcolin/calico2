import { useRef, useEffect } from 'react'

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      
      // Set sketchy line style
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      
      // Clear canvas with sketchy sky background
      drawSketchyBackground(ctx, canvas.width, canvas.height)
      
      // Draw river
      drawRiver(ctx, canvas.width, canvas.height)
      
      // Draw trees
      drawTrees(ctx, canvas.width, canvas.height)
      
      // Draw buildings
      drawBuildings(ctx, canvas.width, canvas.height)
    }

    const jitter = (value: number, amount: number = 2) => {
      return value + (Math.random() - 0.5) * amount
    }

    const drawSketchyLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, segments: number = 8) => {
      ctx.beginPath()
      ctx.moveTo(jitter(x1), jitter(y1))
      
      for (let i = 1; i <= segments; i++) {
        const t = i / segments
        const x = x1 + (x2 - x1) * t
        const y = y1 + (y2 - y1) * t
        ctx.lineTo(jitter(x, 3), jitter(y, 3))
      }
      ctx.stroke()
    }

    const drawSketchyRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, fill: boolean = true) => {
      if (fill) {
        ctx.beginPath()
        ctx.moveTo(jitter(x), jitter(y))
        ctx.lineTo(jitter(x + width), jitter(y))
        ctx.lineTo(jitter(x + width), jitter(y + height))
        ctx.lineTo(jitter(x), jitter(y + height))
        ctx.closePath()
        ctx.fill()
      }
      
      // Draw sketchy outline
      ctx.lineWidth = 2
      drawSketchyLine(ctx, x, y, x + width, y)
      drawSketchyLine(ctx, x + width, y, x + width, y + height)
      drawSketchyLine(ctx, x + width, y + height, x, y + height)
      drawSketchyLine(ctx, x, y + height, x, y)
    }

    const drawSketchyCircle = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill: boolean = true) => {
      const points = 16
      const angleStep = (Math.PI * 2) / points
      
      if (fill) {
        ctx.beginPath()
        for (let i = 0; i <= points; i++) {
          const angle = i * angleStep
          const px = x + Math.cos(angle) * jitter(radius, 3)
          const py = y + Math.sin(angle) * jitter(radius, 3)
          if (i === 0) {
            ctx.moveTo(px, py)
          } else {
            ctx.lineTo(px, py)
          }
        }
        ctx.closePath()
        ctx.fill()
      }
      
      // Draw sketchy outline
      ctx.beginPath()
      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep
        const px = x + Math.cos(angle) * jitter(radius, 2)
        const py = y + Math.sin(angle) * jitter(radius, 2)
        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.stroke()
    }

    const drawSketchyBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      // Base sky color
      ctx.fillStyle = '#87CEEB'
      ctx.fillRect(0, 0, width, height)
      
      // Add sketchy texture with random strokes
      ctx.strokeStyle = 'rgba(135, 206, 235, 0.3)'
      ctx.lineWidth = 1
      for (let i = 0; i < 100; i++) {
        const x1 = Math.random() * width
        const y1 = Math.random() * height * 0.6
        const x2 = x1 + (Math.random() - 0.5) * 50
        const y2 = y1 + (Math.random() - 0.5) * 20
        drawSketchyLine(ctx, x1, y1, x2, y2, 3)
      }
    }

    const drawRiver = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const riverWidth = 80
      const centerY = height * 0.7
      
      // Draw river with sketchy fill
      ctx.fillStyle = '#4682B4'
      ctx.beginPath()
      
      // Top edge of river
      ctx.moveTo(jitter(0), jitter(centerY - riverWidth/2))
      for (let x = 0; x <= width; x += 10) {
        const curve = Math.sin(x * 0.01) * 30 + Math.sin(x * 0.003) * 50
        const y1 = centerY + curve - riverWidth/2
        ctx.lineTo(jitter(x), jitter(y1, 4))
      }
      
      // Bottom edge of river
      for (let x = width; x >= 0; x -= 10) {
        const curve = Math.sin(x * 0.01) * 30 + Math.sin(x * 0.003) * 50
        const y2 = centerY + curve + riverWidth/2
        ctx.lineTo(jitter(x), jitter(y2, 4))
      }
      
      ctx.closePath()
      ctx.fill()
      
      // Add sketchy water texture
      ctx.strokeStyle = '#1E90FF'
      ctx.lineWidth = 2
      for (let x = 20; x < width - 20; x += 25) {
        const curve = Math.sin(x * 0.01) * 30 + Math.sin(x * 0.003) * 50
        const y = centerY + curve
        drawSketchyLine(ctx, x - 10, y - 5, x + 10, y + 5, 4)
        drawSketchyLine(ctx, x - 8, y + 8, x + 12, y - 8, 4)
      }
      
      // Sketchy river banks
      ctx.strokeStyle = '#006400'
      ctx.lineWidth = 3
      for (let x = 0; x <= width; x += 15) {
        const curve = Math.sin(x * 0.01) * 30 + Math.sin(x * 0.003) * 50
        const y1 = centerY + curve - riverWidth/2
        const y2 = centerY + curve + riverWidth/2
        
        if (x > 0) {
          const prevCurve = Math.sin((x-15) * 0.01) * 30 + Math.sin((x-15) * 0.003) * 50
          const prevY1 = centerY + prevCurve - riverWidth/2
          const prevY2 = centerY + prevCurve + riverWidth/2
          drawSketchyLine(ctx, x-15, prevY1, x, y1, 3)
          drawSketchyLine(ctx, x-15, prevY2, x, y2, 3)
        }
      }
    }

    const drawTrees = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const treePositions = [
        { x: width * 0.15, y: height * 0.4 },
        { x: width * 0.25, y: height * 0.3 },
        { x: width * 0.8, y: height * 0.35 },
        { x: width * 0.9, y: height * 0.45 },
        { x: width * 0.05, y: height * 0.5 },
        { x: width * 0.35, y: height * 0.25 }
      ]
      
      treePositions.forEach(pos => {
        // Sketchy tree trunk
        ctx.fillStyle = '#8B4513'
        ctx.strokeStyle = '#654321'
        drawSketchyRect(ctx, pos.x - 8, pos.y, 16, 40)
        
        // Add some bark texture
        ctx.strokeStyle = '#654321'
        ctx.lineWidth = 1
        for (let i = 0; i < 5; i++) {
          const y = pos.y + i * 8 + 5
          drawSketchyLine(ctx, pos.x - 6, y, pos.x + 6, y, 3)
        }
        
        // Sketchy tree foliage - multiple layers
        ctx.fillStyle = '#228B22'
        ctx.strokeStyle = '#006400'
        ctx.lineWidth = 2
        drawSketchyCircle(ctx, pos.x, pos.y - 10, 25)
        
        // Additional foliage clumps for more organic look
        ctx.fillStyle = '#32CD32'
        drawSketchyCircle(ctx, pos.x - 8, pos.y - 5, 15)
        
        ctx.fillStyle = '#006400'
        drawSketchyCircle(ctx, pos.x + 5, pos.y - 15, 12)
        
        // Add some sketchy leaves
        ctx.strokeStyle = '#228B22'
        ctx.lineWidth = 1
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2
          const leafX = pos.x + Math.cos(angle) * (20 + Math.random() * 10)
          const leafY = pos.y - 10 + Math.sin(angle) * (20 + Math.random() * 10)
          drawSketchyCircle(ctx, leafX, leafY, 3, false)
        }
      })
    }

    const drawBuildings = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const buildings = [
        { x: width * 0.45, y: height * 0.15, width: 60, height: 80 },
        { x: width * 0.55, y: height * 0.1, width: 80, height: 100 },
        { x: width * 0.65, y: height * 0.2, width: 50, height: 70 },
        { x: width * 0.75, y: height * 0.12, width: 70, height: 90 }
      ]
      
      buildings.forEach(building => {
        // Sketchy building structure
        ctx.fillStyle = '#B22222'
        ctx.strokeStyle = '#8B0000'
        drawSketchyRect(ctx, building.x, building.y, building.width, building.height)
        
        // Sketchy brick pattern
        ctx.strokeStyle = '#8B0000'
        ctx.lineWidth = 1
        
        // Horizontal brick lines with jitter
        for (let y = building.y + 10; y < building.y + building.height; y += 12) {
          drawSketchyLine(ctx, building.x, y, building.x + building.width, y, 6)
        }
        
        // Vertical brick lines (offset pattern)
        for (let y = building.y; y < building.y + building.height; y += 24) {
          for (let x = building.x + 20; x < building.x + building.width; x += 25) {
            drawSketchyLine(ctx, x, y, x, y + 12, 2)
          }
        }
        
        for (let y = building.y + 12; y < building.y + building.height; y += 24) {
          for (let x = building.x + 8; x < building.x + building.width; x += 25) {
            drawSketchyLine(ctx, x, y, x, y + 12, 2)
          }
        }
        
        // Sketchy windows
        ctx.fillStyle = '#FFD700'
        ctx.strokeStyle = '#DAA520'
        ctx.lineWidth = 1
        
        const windowRows = Math.floor(building.height / 30)
        const windowCols = Math.floor(building.width / 25)
        
        for (let row = 1; row < windowRows; row++) {
          for (let col = 1; col < windowCols; col++) {
            const windowX = building.x + col * 22 + 8
            const windowY = building.y + row * 25 + 8
            
            // Draw window with sketchy style
            drawSketchyRect(ctx, windowX, windowY, 12, 16)
            
            // Window cross pattern
            drawSketchyLine(ctx, windowX + 6, windowY, windowX + 6, windowY + 16, 2)
            drawSketchyLine(ctx, windowX, windowY + 8, windowX + 12, windowY + 8, 2)
          }
        }
        
        // Add some architectural details
        ctx.strokeStyle = '#8B0000'
        ctx.lineWidth = 3
        
        // Sketchy roofline
        drawSketchyLine(ctx, building.x - 5, building.y, building.x + building.width + 5, building.y, 4)
        
        // Door (on some buildings)
        if (Math.random() > 0.5) {
          ctx.fillStyle = '#654321'
          const doorX = building.x + building.width / 2 - 8
          const doorY = building.y + building.height - 25
          drawSketchyRect(ctx, doorX, doorY, 16, 25)
          
          // Door handle
          ctx.fillStyle = '#FFD700'
          drawSketchyCircle(ctx, doorX + 12, doorY + 12, 2, false)
        }
      })
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        border: 'none',
        outline: 'none'
      }}
    />
  )
}

export default App
