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

      // Draw cabins
      drawCabins(ctx, canvas.width, canvas.height)

      // Draw mill
      drawMill(ctx, canvas.width, canvas.height)

      // Draw bakery
      drawBakery(ctx, canvas.width, canvas.height)
    }

    const jitter = (value: number, amount: number = 2) => {
      return value + (Math.random() - 0.5) * amount
    }

    const drawSketchyLine = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      segments: number = 8,
    ) => {
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

    const drawSketchyRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      fill: boolean = true,
    ) => {
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

    const drawSketchyCircle = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      fill: boolean = true,
    ) => {
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

    const drawSketchyBackground = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
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

    const drawRiver = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      const riverStartY = height * 1 // Start at bottom of screen (foreground)
      const riverEndY = height * 0.3 // End at middle of screen (horizon)
      const riverCenterX = width * 0.5 // River flows down the center
      const riverStartWidth = 200 // Very wide in foreground
      const riverEndWidth = 8 // Vanishing point width

      // Create gradient for perspective fade
      const riverGradient = ctx.createLinearGradient(
        0,
        riverStartY,
        0,
        riverEndY,
      )
      riverGradient.addColorStop(0, '#4682B4')
      riverGradient.addColorStop(0.8, '#87CEEB')
      riverGradient.addColorStop(1, '#B0C4DE')

      ctx.fillStyle = riverGradient
      ctx.beginPath()
      const meander = 300

      // Draw river flowing vertically with perspective
      // Left bank (going from bottom to middle)
      for (let y = riverStartY; y >= riverEndY; y -= 5) {
        const progress = (riverStartY - y) / (riverStartY - riverEndY)
        const currentWidth =
          riverStartWidth + (riverEndWidth - riverStartWidth) * progress

        // Add gentle meandering that diminishes with distance
        const curveAmount = (1 - progress) * meander + progress * 5
        const curve =
          Math.sin(y * 0.01) * curveAmount +
          Math.sin(y * 0.003) * curveAmount * 0.3

        const x1 = riverCenterX + curve - currentWidth / 2

        if (y === riverStartY) {
          ctx.moveTo(jitter(x1), jitter(y))
        } else {
          ctx.lineTo(jitter(x1, 2), jitter(y, 1))
        }
      }

      // Right bank (going from middle back to bottom)
      for (let y = riverEndY; y <= riverStartY; y += 5) {
        const progress = (riverStartY - y) / (riverStartY - riverEndY)
        const currentWidth =
          riverStartWidth + (riverEndWidth - riverStartWidth) * progress

        const curveAmount = (1 - progress) * meander + progress * 5
        const curve =
          Math.sin(y * 0.01) * curveAmount +
          Math.sin(y * 0.003) * curveAmount * 0.3

        const x2 = riverCenterX + curve + currentWidth / 2
        ctx.lineTo(jitter(x2, 2), jitter(y, 1))
      }

      ctx.closePath()
      ctx.fill()

      // Add sketchy water texture flowing vertically
      ctx.strokeStyle = '#1E90FF'
      for (let y = riverStartY - 10; y >= riverEndY + 10; y -= 15) {
        const progress = (riverStartY - y) / (riverStartY - riverEndY)
        const currentWidth =
          riverStartWidth + (riverEndWidth - riverStartWidth) * progress
        const curveAmount = (1 - progress) * meander + progress * 5
        const curve =
          Math.sin(y * 0.01) * curveAmount +
          Math.sin(y * 0.003) * curveAmount * 0.3

        const centerX = riverCenterX + curve
        const lineWidth = Math.max(0.5, 2 * (1 - progress))
        const rippleSize = Math.max(3, 12 * (1 - progress))

        ctx.lineWidth = lineWidth

        // Draw horizontal ripples across the river
        drawSketchyLine(
          ctx,
          centerX - currentWidth / 3,
          y,
          centerX + currentWidth / 3,
          y,
          3,
        )

        // Add some diagonal flow lines
        if (Math.random() > 0.7) {
          drawSketchyLine(
            ctx,
            centerX - rippleSize,
            y - 5,
            centerX + rippleSize,
            y + 5,
            2,
          )
        }
      }

      // Sketchy river banks flowing vertically
      ctx.strokeStyle = '#1E6B9F'
      for (let y = riverStartY; y >= riverEndY; y -= 8) {
        const progress = (riverStartY - y) / (riverStartY - riverEndY)
        const currentWidth =
          riverStartWidth + (riverEndWidth - riverStartWidth) * progress
        const curveAmount = (1 - progress) * meander + progress * 5
        const curve =
          Math.sin(y * 0.01) * curveAmount +
          Math.sin(y * 0.003) * curveAmount * 0.3

        const x1 = riverCenterX + curve - currentWidth / 2
        const x2 = riverCenterX + curve + currentWidth / 2
        const bankLineWidth = Math.max(0.5, 3 * (1 - progress * 0.8))

        ctx.lineWidth = bankLineWidth

        if (y < riverStartY - 8) {
          const prevProgress =
            (riverStartY - (y + 8)) / (riverStartY - riverEndY)
          const prevWidth =
            riverStartWidth + (riverEndWidth - riverStartWidth) * prevProgress
          const prevCurveAmount =
            (1 - prevProgress) * meander + prevProgress * 5
          const prevCurve =
            Math.sin((y + 8) * 0.01) * prevCurveAmount +
            Math.sin((y + 8) * 0.003) * prevCurveAmount * 0.3

          const prevX1 = riverCenterX + prevCurve - prevWidth / 2
          const prevX2 = riverCenterX + prevCurve + prevWidth / 2

          drawSketchyLine(ctx, prevX1, y + 8, x1, y, 2)
          drawSketchyLine(ctx, prevX2, y + 8, x2, y, 2)
        }
      }
    }

    const drawTrees = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Generate 100 tree positions dynamically
      const treePositions = []
      // Generate trees for both sides of the river
      for (let i = 0; i < 100; i++) {
        // Randomly place trees, avoiding the middle of the screen (where the river is)
        const side = Math.random() > 0.5 ? 1 : -1 // Left or right side
        const x = width * (0.5 + side * (0.2 + Math.random() * 0.3)) // 0.2-0.5 away from center on either side
        // Vary the y positions for depth
        const y = height * (0.2 + Math.random() * 0.4) // Between 0.2 and 0.6 of screen height
        treePositions.push({ x, y })
      }

      // Sort trees by y-coordinate (from background to foreground)
      treePositions.sort((a, b) => a.y - b.y)

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

        // Draw sketchy pine tree foliage with triangles
        const drawSketchyTriangle = (
          x: number,
          y: number,
          width: number,
          height: number,
          fill: boolean = true,
        ) => {
          if (fill) {
            ctx.beginPath()
            ctx.moveTo(jitter(x), jitter(y))
            ctx.lineTo(jitter(x - width / 2), jitter(y + height))
            ctx.lineTo(jitter(x + width / 2), jitter(y + height))
            ctx.closePath()
            ctx.fill()
          }

          // Draw sketchy outline
          ctx.lineWidth = 2
          drawSketchyLine(ctx, x, y, x - width / 2, y + height, 4)
          drawSketchyLine(
            ctx,
            x - width / 2,
            y + height,
            x + width / 2,
            y + height,
            4,
          )
          drawSketchyLine(ctx, x + width / 2, y + height, x, y, 4)
        }

        // Multiple layers of pine tree triangles
        ctx.fillStyle = '#006400' // Dark green
        ctx.strokeStyle = '#005000'
        drawSketchyTriangle(pos.x, pos.y - 55, 50, 30)

        ctx.fillStyle = '#228B22' // Forest green
        ctx.strokeStyle = '#006400'
        drawSketchyTriangle(pos.x, pos.y - 35, 60, 35)

        ctx.fillStyle = '#2E8B57' // Sea green
        ctx.strokeStyle = '#228B22'
        drawSketchyTriangle(pos.x, pos.y - 15, 70, 40)

        // Add some sketchy pine needle details
        // ctx.strokeStyle = '#32CD32' // Lime green
        // ctx.lineWidth = 1
        // for (let i = 0; i < 12; i++) {
        //   const layerY = pos.y - 50 + i * 12
        //   const width = 50 + i * 2
        //   const startX = pos.x - width / 2 + Math.random() * 10
        //   const endX = pos.x + width / 2 - Math.random() * 10
        //   if (layerY < pos.y) {
        //     drawSketchyLine(ctx, startX, layerY, endX, layerY, 3)
        //   }
        // }

        // Add some random needle clusters
        // for (let i = 0; i < 8; i++) {
        //   const angle = (i / 8) * Math.PI * 2
        //   const needleX = pos.x + Math.cos(angle) * (20 + Math.random() * 15)
        //   const needleY =
        //     pos.y - 30 + Math.sin(angle) * (20 + Math.random() * 15)
        //   const needleLength = 5 + Math.random() * 5
        //   const needleAngle = Math.random() * Math.PI
        //
        //   drawSketchyLine(
        //     ctx,
        //     needleX,
        //     needleY,
        //     needleX + Math.cos(needleAngle) * needleLength,
        //     needleY + Math.sin(needleAngle) * needleLength,
        //     2,
        //   )
        // }
      })
    }

    const drawBuildings = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Dynamically generate 10 buildings on the right side of the river
      const buildings = []
      // Track occupied areas to prevent overlaps
      const isOverlapping = (newBuilding: any, existingBuildings: any[]) => {
        // Add some padding between buildings
        const padding = 10
        for (const building of existingBuildings) {
          if (
            newBuilding.x - padding < building.x + building.width + padding &&
            newBuilding.x + newBuilding.width + padding >
              building.x - padding &&
            newBuilding.y - padding < building.y + building.height + padding &&
            newBuilding.y + newBuilding.height + padding > building.y - padding
          ) {
            return true // Overlap detected
          }
        }
        return false
      }

      // Try to place buildings with a maximum number of attempts
      const maxAttempts = 50
      let attempts = 0

      while (buildings.length < 10 && attempts < maxAttempts) {
        // Position buildings on the right side of the screen (0.4-0.8 of width)
        const x = width * (0.4 + Math.random() * 0.4)
        // Vary the y positions for depth (0.05-0.25 of height)
        const y = height * (0.05 + Math.random() * 0.2)
        // Vary building sizes
        const buildingWidth = 40 + Math.random() * 60
        const buildingHeight = 60 + Math.random() * 80

        const newBuilding = {
          x,
          y,
          width: buildingWidth,
          height: buildingHeight,
        }

        if (!isOverlapping(newBuilding, buildings)) {
          buildings.push(newBuilding)
        }

        attempts++
      }

      buildings.forEach(building => {
        // Sketchy building structure
        ctx.fillStyle = '#B22222'
        ctx.strokeStyle = '#8B0000'
        drawSketchyRect(
          ctx,
          building.x,
          building.y,
          building.width,
          building.height,
        )

        // Sketchy brick pattern
        ctx.strokeStyle = '#8B0000'
        ctx.lineWidth = 1

        // Horizontal brick lines with jitter
        for (
          let y = building.y + 10;
          y < building.y + building.height;
          y += 12
        ) {
          drawSketchyLine(ctx, building.x, y, building.x + building.width, y, 6)
        }

        // Vertical brick lines (offset pattern)
        for (let y = building.y; y < building.y + building.height; y += 24) {
          for (
            let x = building.x + 20;
            x < building.x + building.width;
            x += 25
          ) {
            drawSketchyLine(ctx, x, y, x, y + 12, 2)
          }
        }

        for (
          let y = building.y + 12;
          y < building.y + building.height;
          y += 24
        ) {
          for (
            let x = building.x + 8;
            x < building.x + building.width;
            x += 25
          ) {
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
            drawSketchyLine(
              ctx,
              windowX + 6,
              windowY,
              windowX + 6,
              windowY + 16,
              2,
            )
            drawSketchyLine(
              ctx,
              windowX,
              windowY + 8,
              windowX + 12,
              windowY + 8,
              2,
            )
          }
        }

        // Add some architectural details
        ctx.strokeStyle = '#8B0000'
        ctx.lineWidth = 3

        // Sketchy roofline
        drawSketchyLine(
          ctx,
          building.x - 5,
          building.y,
          building.x + building.width + 5,
          building.y,
          4,
        )

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

    const drawCabins = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Generate cabin positions on the left side of the river
      const cabins = []
      const maxAttempts = 30
      let attempts = 0

      const isOverlapping = (newCabin: any, existingCabins: any[]) => {
        const padding = 15
        for (const cabin of existingCabins) {
          if (
            newCabin.x - padding < cabin.x + cabin.width + padding &&
            newCabin.x + newCabin.width + padding > cabin.x - padding &&
            newCabin.y - padding < cabin.y + cabin.height + padding &&
            newCabin.y + newCabin.height + padding > cabin.y - padding
          ) {
            return true
          }
        }
        return false
      }

      while (cabins.length < 6 && attempts < maxAttempts) {
        // Position cabins on the left side of the screen
        const x = width * (0.05 + Math.random() * 0.3)
        const y = height * (0.1 + Math.random() * 0.15)
        const cabinWidth = 50 + Math.random() * 100
        const cabinHeight = 40 + Math.random() * 20

        const newCabin = { x, y, width: cabinWidth, height: cabinHeight }

        if (!isOverlapping(newCabin, cabins)) {
          cabins.push(newCabin)
        }
        attempts++
      }

      cabins.forEach((cabin, index) => {
        const houseType = index % 5 // 5 different house types

        // Traditional Log Cabin (default)
        ctx.fillStyle = '#8B4513'
        ctx.strokeStyle = '#654321'
        drawSketchyRect(ctx, cabin.x, cabin.y, cabin.width, cabin.height)

        // Log lines
        for (let y = cabin.y + 8; y < cabin.y + cabin.height; y += 8) {
          drawSketchyLine(ctx, cabin.x, y, cabin.x + cabin.width, y, 4)
        }

        // Traditional triangular roof
        ctx.fillStyle = '#8B0000'
        const roofHeight = 20
        ctx.beginPath()
        ctx.moveTo(jitter(cabin.x - 5), jitter(cabin.y))
        ctx.lineTo(
          jitter(cabin.x + cabin.width / 2),
          jitter(cabin.y - roofHeight),
        )
        ctx.lineTo(jitter(cabin.x + cabin.width + 5), jitter(cabin.y))
        ctx.closePath()
        ctx.fill()

        // Chimney
        const chimneyX = cabin.x + cabin.width * 0.7
        const chimneyY = cabin.y - roofHeight - 5
        drawSketchyRect(ctx, chimneyX, chimneyY, 8, 20)

        // Smoke puffs
        for (let i = 0; i < 4; i++) {
          const puffY = chimneyY - i * 15 - 10
          const drift = Math.sin(i * 0.8 + index) * 8 + i * 3
          const puffSize = 4 + i * 2

          ctx.fillStyle = `rgba(211, 211, 211, ${0.7 - i * 0.15})`
          drawSketchyCircle(ctx, chimneyX + drift, puffY, puffSize, true)
        }

        // Standard rectangular door and windows for other types
        const doorWidth = 12
        const doorHeight = 18
        const doorX = cabin.x + cabin.width / 2 - doorWidth / 2
        const doorY = cabin.y + cabin.height - doorHeight

        ctx.fillStyle = '#654321'
        drawSketchyRect(ctx, doorX, doorY, doorWidth, doorHeight)

        // Door handle
        ctx.fillStyle = '#FFD700'
        drawSketchyCircle(
          ctx,
          doorX + doorWidth - 3,
          doorY + doorHeight / 2,
          1.5,
          false,
        )

        // Windows
        const windowSize = 8
        ctx.fillStyle = '#FFD700'

        if (houseType === 2) {
          // L-shape gets windows on both sections
          drawSketchyRect(
            ctx,
            cabin.x + 8,
            cabin.y + 12,
            windowSize,
            windowSize,
          )
          drawSketchyRect(
            ctx,
            cabin.x + cabin.width * 0.75,
            cabin.y + cabin.height * 0.5,
            windowSize,
            windowSize,
          )
        } else if (houseType === 3) {
          // Two-story gets windows on both floors
          drawSketchyRect(
            ctx,
            cabin.x + cabin.width * 0.1,
            cabin.y + cabin.height * 0.5,
            windowSize,
            windowSize,
          )
          drawSketchyRect(
            ctx,
            cabin.x + cabin.width * 0.35,
            cabin.y + 8,
            windowSize * 0.7,
            windowSize * 0.7,
          )
        } else {
          // Traditional single window
          drawSketchyRect(
            ctx,
            cabin.x + 8,
            cabin.y + 12,
            windowSize,
            windowSize,
          )
        }
      })
    }

    const drawMill = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Position mill in foreground along the river
      const millX = width * 0.35 // Left side of river
      const millY = height * 0.7 // In the foreground
      const millWidth = 80
      const millHeight = 60

      // Mill building - stone structure
      ctx.fillStyle = '#696969' // Dark gray stone
      ctx.strokeStyle = '#2F2F2F'
      drawSketchyRect(ctx, millX, millY, millWidth, millHeight)

      // Stone texture
      ctx.strokeStyle = '#2F2F2F'
      ctx.lineWidth = 1
      for (let y = millY + 8; y < millY + millHeight; y += 12) {
        for (let x = millX + 8; x < millX + millWidth; x += 15) {
          if (Math.random() > 0.6) {
            drawSketchyLine(ctx, x, y, x + 8, y, 2)
            drawSketchyLine(ctx, x, y, x, y + 8, 2)
          }
        }
      }

      // Mill roof - red tile
      ctx.fillStyle = '#8B4513'
      const roofHeight = 25
      ctx.beginPath()
      ctx.moveTo(jitter(millX - 8), jitter(millY))
      ctx.lineTo(jitter(millX + millWidth / 2), jitter(millY - roofHeight))
      ctx.lineTo(jitter(millX + millWidth + 8), jitter(millY))
      ctx.closePath()
      ctx.fill()

      // Roof outline
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 2
      drawSketchyLine(ctx, millX - 8, millY, millX + millWidth / 2, millY - roofHeight, 3)
      drawSketchyLine(ctx, millX + millWidth / 2, millY - roofHeight, millX + millWidth + 8, millY, 3)

      // Water wheel
      const wheelCenterX = millX - 15
      const wheelCenterY = millY + millHeight / 2
      const wheelRadius = 35

      // Water wheel frame
      ctx.fillStyle = '#8B4513'
      ctx.strokeStyle = '#654321'
      drawSketchyCircle(ctx, wheelCenterX, wheelCenterY, wheelRadius, false)

      // Water wheel spokes
      ctx.lineWidth = 3
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4
        const x1 = wheelCenterX + Math.cos(angle) * 8
        const y1 = wheelCenterY + Math.sin(angle) * 8
        const x2 = wheelCenterX + Math.cos(angle) * (wheelRadius - 5)
        const y2 = wheelCenterY + Math.sin(angle) * (wheelRadius - 5)
        drawSketchyLine(ctx, x1, y1, x2, y2, 2)
      }

      // Water wheel paddles
      ctx.fillStyle = '#654321'
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12
        const paddleX = wheelCenterX + Math.cos(angle) * (wheelRadius - 8)
        const paddleY = wheelCenterY + Math.sin(angle) * (wheelRadius - 8)
        const paddleWidth = 8
        const paddleHeight = 12
        
        // Rotate paddle based on wheel position
        ctx.save()
        ctx.translate(paddleX, paddleY)
        ctx.rotate(angle + Math.PI / 2)
        drawSketchyRect(ctx, -paddleWidth/2, -paddleHeight/2, paddleWidth, paddleHeight)
        ctx.restore()
      }

      // Water flowing over wheel
      ctx.strokeStyle = '#1E90FF'
      ctx.lineWidth = 2
      for (let i = 0; i < 5; i++) {
        const waterY = wheelCenterY - wheelRadius + i * 8
        const waterX = wheelCenterX - wheelRadius + Math.random() * 10
        drawSketchyLine(ctx, waterX, waterY, waterX + 15, waterY + 20, 3)
      }

      // Mill door
      const doorWidth = 16
      const doorHeight = 25
      const doorX = millX + millWidth / 2 - doorWidth / 2
      const doorY = millY + millHeight - doorHeight

      ctx.fillStyle = '#654321'
      drawSketchyRect(ctx, doorX, doorY, doorWidth, doorHeight)

      // Door handle
      ctx.fillStyle = '#FFD700'
      drawSketchyCircle(ctx, doorX + doorWidth - 3, doorY + doorHeight / 2, 2, false)

      // Mill windows
      ctx.fillStyle = '#FFD700'
      const windowSize = 10
      drawSketchyRect(ctx, millX + 15, millY + 15, windowSize, windowSize)
      drawSketchyRect(ctx, millX + millWidth - 25, millY + 15, windowSize, windowSize)

      // Window crosses
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 1
      drawSketchyLine(ctx, millX + 20, millY + 15, millX + 20, millY + 25, 2)
      drawSketchyLine(ctx, millX + 15, millY + 20, millX + 25, millY + 20, 2)
      drawSketchyLine(ctx, millX + millWidth - 20, millY + 15, millX + millWidth - 20, millY + 25, 2)
      drawSketchyLine(ctx, millX + millWidth - 25, millY + 20, millX + millWidth - 15, millY + 20, 2)
    }

    const drawBakery = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Position bakery near the mill
      const bakeryX = width * 0.48 // Right of the mill
      const bakeryY = height * 0.72 // Slightly behind mill in foreground
      const bakeryWidth = 70
      const bakeryHeight = 55

      // Bakery building - warm brick color
      ctx.fillStyle = '#CD853F' // Sandy brown brick
      ctx.strokeStyle = '#8B4513'
      drawSketchyRect(ctx, bakeryX, bakeryY, bakeryWidth, bakeryHeight)

      // Brick pattern
      ctx.strokeStyle = '#8B4513'
      ctx.lineWidth = 1
      for (let y = bakeryY + 8; y < bakeryY + bakeryHeight; y += 10) {
        drawSketchyLine(ctx, bakeryX, y, bakeryX + bakeryWidth, y, 6)
      }

      // Vertical brick lines (offset pattern)
      for (let y = bakeryY; y < bakeryY + bakeryHeight; y += 20) {
        for (let x = bakeryX + 15; x < bakeryX + bakeryWidth; x += 20) {
          drawSketchyLine(ctx, x, y, x, y + 10, 2)
        }
      }
      for (let y = bakeryY + 10; y < bakeryY + bakeryHeight; y += 20) {
        for (let x = bakeryX + 5; x < bakeryX + bakeryWidth; x += 20) {
          drawSketchyLine(ctx, x, y, x, y + 10, 2)
        }
      }

      // Bakery roof - darker brown
      ctx.fillStyle = '#654321'
      const roofHeight = 22
      ctx.beginPath()
      ctx.moveTo(jitter(bakeryX - 6), jitter(bakeryY))
      ctx.lineTo(jitter(bakeryX + bakeryWidth / 2), jitter(bakeryY - roofHeight))
      ctx.lineTo(jitter(bakeryX + bakeryWidth + 6), jitter(bakeryY))
      ctx.closePath()
      ctx.fill()

      // Roof outline
      ctx.strokeStyle = '#4A2C2A'
      ctx.lineWidth = 2
      drawSketchyLine(ctx, bakeryX - 6, bakeryY, bakeryX + bakeryWidth / 2, bakeryY - roofHeight, 3)
      drawSketchyLine(ctx, bakeryX + bakeryWidth / 2, bakeryY - roofHeight, bakeryX + bakeryWidth + 6, bakeryY, 3)

      // Chimney with smoke
      const chimneyX = bakeryX + bakeryWidth * 0.75
      const chimneyY = bakeryY - roofHeight - 3
      ctx.fillStyle = '#8B4513'
      drawSketchyRect(ctx, chimneyX, chimneyY, 8, 18)

      // Smoke puffs from bakery
      for (let i = 0; i < 5; i++) {
        const puffY = chimneyY - i * 12 - 8
        const drift = Math.sin(i * 0.9) * 6 + i * 2
        const puffSize = 3 + i * 1.5

        ctx.fillStyle = `rgba(240, 240, 240, ${0.8 - i * 0.12})`
        drawSketchyCircle(ctx, chimneyX + drift, puffY, puffSize, true)
      }

      // Large bakery window
      ctx.fillStyle = '#FFE4B5' // Warm window light
      const windowWidth = 18
      const windowHeight = 14
      const windowX = bakeryX + 12
      const windowY = bakeryY + 18
      drawSketchyRect(ctx, windowX, windowY, windowWidth, windowHeight)

      // Window cross pattern
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 2
      drawSketchyLine(ctx, windowX + windowWidth/2, windowY, windowX + windowWidth/2, windowY + windowHeight, 2)
      drawSketchyLine(ctx, windowX, windowY + windowHeight/2, windowX + windowWidth, windowY + windowHeight/2, 2)

      // Small window on right
      const smallWindowSize = 10
      drawSketchyRect(ctx, bakeryX + bakeryWidth - 22, bakeryY + 15, smallWindowSize, smallWindowSize)
      
      // Small window cross
      drawSketchyLine(ctx, bakeryX + bakeryWidth - 17, bakeryY + 15, bakeryX + bakeryWidth - 17, bakeryY + 25, 2)
      drawSketchyLine(ctx, bakeryX + bakeryWidth - 22, bakeryY + 20, bakeryX + bakeryWidth - 12, bakeryY + 20, 2)

      // Bakery door
      const doorWidth = 14
      const doorHeight = 22
      const doorX = bakeryX + bakeryWidth - doorWidth - 5
      const doorY = bakeryY + bakeryHeight - doorHeight

      ctx.fillStyle = '#8B4513'
      drawSketchyRect(ctx, doorX, doorY, doorWidth, doorHeight)

      // Door handle
      ctx.fillStyle = '#FFD700'
      drawSketchyCircle(ctx, doorX + 3, doorY + doorHeight / 2, 1.5, false)

      // Hanging sign for "Ye Olde Bakery"
      const signX = bakeryX + bakeryWidth / 2 - 25
      const signY = bakeryY - 15
      const signWidth = 50
      const signHeight = 12

      // Sign post
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 3
      drawSketchyLine(ctx, signX + signWidth / 2, bakeryY, signX + signWidth / 2, signY + signHeight, 2)

      // Sign board
      ctx.fillStyle = '#DEB887' // Burlywood
      ctx.strokeStyle = '#8B7355'
      drawSketchyRect(ctx, signX, signY, signWidth, signHeight)

      // Sign text "Ye Olde Bakery"
      ctx.fillStyle = '#654321'
      ctx.font = '8px serif'
      ctx.textAlign = 'center'
      ctx.fillText('Ye Olde Bakery', signX + signWidth / 2, signY + 8)

      // Sign chains/ropes
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 1
      drawSketchyLine(ctx, signX + signWidth / 2 - 8, signY, signX + 5, signY + 2, 1)
      drawSketchyLine(ctx, signX + signWidth / 2 + 8, signY, signX + signWidth - 5, signY + 2, 1)
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
        outline: 'none',
      }}
    />
  )
}

export default App
