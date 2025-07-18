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

      // Use actual window dimensions as reference (no scaling needed)
      const baseWidth = window.innerWidth
      const baseHeight = window.innerHeight

      // No scaling transformation needed since we use actual dimensions
      ctx.save()

      // Set sketchy line style
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Clear canvas with sketchy sky background (use base dimensions)
      drawSketchyBackground(ctx, baseWidth, baseHeight)

      // Draw mountains (use base dimensions)
      drawMountains(ctx, baseWidth, baseHeight)

      // Draw river
      drawRiver(ctx, baseWidth, baseHeight)

      // Draw trees
      drawTrees(ctx, baseWidth, baseHeight)

      // Draw buildings
      drawBuildings(ctx, baseWidth, baseHeight)

      // Draw cabins
      drawCabins(ctx, baseWidth, baseHeight)

      // Draw mill
      drawMill(ctx, baseWidth, baseHeight)

      // Draw bakery
      drawBakery(ctx, baseWidth, baseHeight)

      // Draw apple orchard
      drawAppleOrchard(ctx, baseWidth, baseHeight)

      // Draw ice cream shop
      drawIceCreamShop(ctx, baseWidth, baseHeight)

      // Draw large house
      // Draw large house
      ctx.save()
      ctx.scale(2, 2) // Scale up by 150%
      drawLargeHouse(ctx, baseWidth / 2, baseHeight / 2)
      ctx.restore()

      // Restore the scaling transformation
      ctx.restore()
    }

    const jitter = (value: number, amount: number = 1) => {
      return value + (Math.random() - 0.5) * amount
    }

    const drawSketchyLine = (
      ctx: CanvasRenderingContext2D,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      segments: number = 16,
      amount = 1,
    ) => {
      ctx.beginPath()
      ctx.moveTo(jitter(x1), jitter(y1))

      for (let i = 1; i <= segments; i++) {
        const t = i / segments
        const x = x1 + (x2 - x1) * t
        const y = y1 + (y2 - y1) * t
        ctx.lineTo(jitter(x, amount), jitter(y, amount))
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
      jitterAmount: number = 1,
    ) => {
      if (fill) {
        ctx.beginPath()
        ctx.moveTo(jitter(x, jitterAmount), jitter(y, jitterAmount))
        ctx.lineTo(jitter(x + width, jitterAmount), jitter(y, jitterAmount))
        ctx.lineTo(
          jitter(x + width, jitterAmount),
          jitter(y + height, jitterAmount),
        )
        ctx.lineTo(jitter(x, jitterAmount), jitter(y + height, jitterAmount))
        ctx.closePath()
        ctx.fill()
      }

      // Draw sketchy outline
      ctx.lineWidth = 1
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
      amount: number = 1,
    ) => {
      const points = 16
      const angleStep = (Math.PI * 2) / points

      if (fill) {
        ctx.beginPath()
        for (let i = 0; i <= points; i++) {
          const angle = i * angleStep
          const px = x + Math.cos(angle) * jitter(radius, amount)
          const py = y + Math.sin(angle) * jitter(radius, amount)
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
      // ctx.beginPath()
      // for (let i = 0; i <= points; i++) {
      //   const angle = i * angleStep
      //   const px = x + Math.cos(angle) * jitter(radius, amount)
      //   const py = y + Math.sin(angle) * jitter(radius, amount)
      //   if (i === 0) {
      //     ctx.moveTo(px, py)
      //   } else {
      //     ctx.lineTo(px, py)
      //   }
      // }
      // ctx.stroke()
    }

    const drawSketchyBackground = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Create sunset gradient for top half (horizon area)
      const horizonY = height * 0.5
      const sunsetGradient = ctx.createLinearGradient(0, 0, 0, horizonY)
      sunsetGradient.addColorStop(0, '#FF6B47') // Deep orange at top
      sunsetGradient.addColorStop(0.3, '#FF8C69') // Salmon
      sunsetGradient.addColorStop(0.6, '#FFB347') // Peach
      sunsetGradient.addColorStop(0.8, '#FFC0CB') // Light pink
      sunsetGradient.addColorStop(1, '#87CEEB') // Sky blue at horizon

      // Fill top half with sunset
      ctx.fillStyle = sunsetGradient
      ctx.fillRect(0, 0, width, horizonY)

      // Bottom half - keep original sky blue
      ctx.fillStyle = '#87CEEB'
      ctx.fillRect(0, horizonY, width, height - horizonY)

      // Add sun disc
      const sunX = width * 0.75 // Right side of sky
      const sunY = height * 0.25 // Upper portion
      const sunRadius = 30

      ctx.fillStyle = '#FFD700' // Golden sun
      drawSketchyCircle(ctx, sunX, sunY, sunRadius, true)

      // Sun rays
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 2
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12
        const rayLength = 15 + Math.random() * 10
        const x1 = sunX + Math.cos(angle) * (sunRadius + 5)
        const y1 = sunY + Math.sin(angle) * (sunRadius + 5)
        const x2 = sunX + Math.cos(angle) * (sunRadius + rayLength)
        const y2 = sunY + Math.sin(angle) * (sunRadius + rayLength)
        drawSketchyLine(ctx, x1, y1, x2, y2, 2)
      }

      // Add sketchy texture with sunset-appropriate colors
      ctx.strokeStyle = 'rgba(255, 140, 105, 0.2)' // Warm sunset texture
      ctx.lineWidth = 1
      for (let i = 0; i < 60; i++) {
        const x1 = Math.random() * width
        const y1 = Math.random() * horizonY
        const x2 = x1 + (Math.random() - 0.5) * 40
        const y2 = y1 + (Math.random() - 0.5) * 15
        drawSketchyLine(ctx, x1, y1, x2, y2, 3)
      }

      // Add some lower sky texture
      ctx.strokeStyle = 'rgba(135, 206, 235, 0.3)'
      for (let i = 0; i < 40; i++) {
        const x1 = Math.random() * width
        const y1 = horizonY + Math.random() * (height - horizonY) * 0.6
        const x2 = x1 + (Math.random() - 0.5) * 30
        const y2 = y1 + (Math.random() - 0.5) * 15
        drawSketchyLine(ctx, x1, y1, x2, y2, 2)
      }
    }

    const drawMountains = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Mountain silhouettes in the background
      const horizonY = height * 0.5
      const mountainBaseY = horizonY - height * 0.1 // Mountains start above horizon

      // Create multiple mountain layers for depth
      const mountainLayers = [
        { peaks: 5, color: '#4B0082', opacity: 0.3, height: 0.15 }, // Far mountains - purple
        { peaks: 4, color: '#483D8B', opacity: 0.5, height: 0.12 }, // Mid mountains - dark slate blue
        { peaks: 3, color: '#6A5ACD', opacity: 0.7, height: 0.1 }, // Near mountains - slate blue
      ] as const

      mountainLayers.forEach(layer => {
        ctx.fillStyle = layer.color
        ctx.globalAlpha = layer.opacity

        // Generate mountain peaks
        const peakWidth = width / layer.peaks

        ctx.beginPath()
        ctx.moveTo(0, mountainBaseY)

        for (let i = 0; i <= layer.peaks; i++) {
          const x = i * peakWidth
          const peakHeight = height * layer.height * (0.8 + Math.random() * 0.4)
          const y = mountainBaseY - peakHeight

          // Add some randomness to peak positions
          const peakX = x + (Math.random() - 0.5) * peakWidth * 0.3

          if (i === 0) {
            ctx.lineTo(jitter(peakX, 5), jitter(y, 3))
          } else {
            // Create jagged mountain peaks
            const midX = peakX - peakWidth / 2
            const midY = mountainBaseY - peakHeight * 0.6
            ctx.lineTo(jitter(midX, 4), jitter(midY, 4))
            ctx.lineTo(jitter(peakX, 5), jitter(y, 3))
          }
        }

        ctx.lineTo(width, mountainBaseY)
        ctx.lineTo(0, mountainBaseY)
        ctx.closePath()
        ctx.fill()

        // Add mountain ridges
        ctx.globalAlpha = layer.opacity * 0.8
        ctx.strokeStyle = layer.color
        ctx.lineWidth = 1
        for (let i = 0; i <= layer.peaks; i++) {
          const x = i * peakWidth + (Math.random() - 0.5) * peakWidth * 0.2
          const peakHeight = height * layer.height * (0.7 + Math.random() * 0.3)
          const y = mountainBaseY - peakHeight

          if (i < layer.peaks) {
            const nextX =
              (i + 1) * peakWidth + (Math.random() - 0.5) * peakWidth * 0.2
            const nextPeakHeight =
              height * layer.height * (0.7 + Math.random() * 0.3)
            const nextY = mountainBaseY - nextPeakHeight
            drawSketchyLine(ctx, x, y, nextX, nextY, 3)
          }
        }
      })

      // Add forest texture to mountains
      ctx.globalAlpha = 0.8

      mountainLayers.forEach((layer, layerIndex) => {
        const peakWidth = width / layer.peaks
        const forestDensity = layer.opacity * 100 // More forest on closer mountains

        // Add textured forest pattern on mountain slopes
        for (let i = 0; i < forestDensity; i++) {
          const x = Math.random() * width
          const peakIndex = Math.floor(x / peakWidth)
          const localX = x % peakWidth
          const peakProgress = localX / peakWidth

          // Calculate approximate mountain height at this x position
          const peakHeight = height * layer.height * (0.8 + Math.random() * 0.4)
          const slopeHeight =
            peakHeight * (0.3 + Math.sin(peakProgress * Math.PI) * 0.6)
          const mountainY = mountainBaseY - slopeHeight

          // Only place forest texture on mountain slopes (not at peaks)
          if (
            mountainY < mountainBaseY - height * 0.02 &&
            mountainY > mountainBaseY - slopeHeight * 0.9
          ) {
            const forestY = mountainY + Math.random() * height * 0.02

            // Create forest texture using small irregular shapes
            const forestSize = 1 + Math.random() * 2
            const forestOpacity = layer.opacity * (0.6 + Math.random() * 0.4)

            // Use different green shades based on mountain layer
            let forestColor
            if (layerIndex === 0) {
              forestColor = `rgba(20, 60, 20, ${forestOpacity})`
            } else if (layerIndex === 1) {
              forestColor = `rgba(30, 80, 30, ${forestOpacity})`
            } else {
              forestColor = `rgba(40, 100, 40, ${forestOpacity})`
            }

            ctx.fillStyle = forestColor

            // Create irregular forest patches using multiple small dots
            for (let j = 0; j < 3; j++) {
              const dotX = x + (Math.random() - 0.5) * 4
              const dotY = forestY + (Math.random() - 0.5) * 3
              const dotSize = forestSize * (0.5 + Math.random() * 0.5)

              ctx.beginPath()
              ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2)
              ctx.fill()
            }

            // Add some vertical streaks for tree-like texture
            if (Math.random() > 0.8) {
              ctx.strokeStyle = forestColor
              ctx.lineWidth = 0.5
              const streakHeight = 2 + Math.random() * 3
              drawSketchyLine(ctx, x, forestY, x, forestY + streakHeight, 1)
            }
          }
        }
      })

      ctx.globalAlpha = 1.0 // Reset alpha
    }

    const drawRiver = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      const riverStartY = height * 1 // Start at bottom of screen (foreground)
      const riverEndY = height * 0.4 // End at middle of screen (horizon)
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
      riverGradient.addColorStop(0, '#2B5F82') // Darker steel blue
      riverGradient.addColorStop(0.8, '#4682B4') // Steel blue
      riverGradient.addColorStop(1, '#2425aD') // Cornflower blue

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

        // Create wave-like ripples across the river
        const waveWidth = currentWidth / 3
        const waveStartX = centerX - waveWidth
        const waveEndX = centerX + waveWidth

        // // Draw wavy pattern instead of straight line
        // ctx.beginPath()
        // ctx.moveTo(waveStartX, y)
        //
        // const waveCount = Math.floor(3 + Math.random() * 3) // Variable number of waves
        // const waveAmplitude = 2 + Math.random() * 3 // Variable wave height
        //
        // for (let i = 0; i <= waveCount; i++) {
        //   const waveX = waveStartX + (waveEndX - waveStartX) * (i / waveCount)
        //   const waveY =
        //     y +
        //     Math.sin(i * Math.PI) * waveAmplitude * (Math.random() * 0.5 + 0.75)
        //
        //   // Create wave crest/trough effect
        //   if (i === 0) {
        //     ctx.lineTo(waveX, waveY)
        //   } else {
        //     const cpX1 =
        //       waveStartX + (waveEndX - waveStartX) * ((i - 0.5) / waveCount)
        //     const cpY1 = y + Math.sin((i - 0.5) * Math.PI) * waveAmplitude * 1.5
        //     ctx.quadraticCurveTo(cpX1, cpY1, waveX, waveY)
        //   }
        // }
        // ctx.stroke()

        // Add some smaller wave details
        if (Math.random() > 0.5) {
          const detailX = centerX + (Math.random() - 0.5) * waveWidth
          const detailY = y + (Math.random() - 0.5) * 4
          const detailSize = rippleSize * 0.4

          // Create small curved wave detail
          ctx.beginPath()
          ctx.moveTo(detailX - detailSize, detailY)
          ctx.quadraticCurveTo(
            detailX,
            detailY - 2 - Math.random() * 2,
            detailX + detailSize,
            detailY,
          )
          ctx.stroke()
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
      // Generate tree positions with better perspective distribution
      const treePositions = []

      // Background trees (smaller, behind mountains)
      const horizonY = height * 0.5
      const mountainBaseY = horizonY - height * 0.1

      for (let i = 0; i < 1000; i++) {
        const side = Math.random() > 0.5 ? 1 : -1
        const x = width * (0.5 + side * (0.05 + Math.random()))

        // Calculate maximum tree height to not exceed mountain base
        const treeScale = 0.1 + Math.random() * 0.2
        const maxTreeHeight = 55 * treeScale // Top of tree foliage
        const maxTreeY = mountainBaseY - maxTreeHeight

        // Position tree so it doesn't go above mountains
        const y = Math.max(maxTreeY, height * (0.35 + Math.random() * 0.3))

        treePositions.push({ x, y, scale: treeScale, layer: 'background' })
      }

      // Middle distance trees
      for (let i = 0; i < 40; i++) {
        const side = Math.random() > 0.5 ? 1 : -1
        const x = width * (0.5 + side * (0.1 + Math.random()))
        const y = height * (0.6 + Math.random() * 0.15) // Middle distance
        const scale = 0.6 + Math.random() * 0.3
        treePositions.push({ x, y, scale, layer: 'middle' })
      }

      // Foreground trees (largest)
      for (let i = 0; i < 40; i++) {
        const side = Math.random() > 0.5 ? 1 : -1
        const x = width * (0.5 + side * (0.15 + Math.random()))
        const y = height * (0.85 + Math.random() * 0.15) // Foreground
        const scale = 0.5 + Math.random() * 0.8 // Large trees
        treePositions.push({ x, y, scale, layer: 'foreground' })
      }

      // Sort trees by y-coordinate (from background to foreground)
      treePositions.sort((a, b) => a.y - b.y)

      treePositions.forEach(pos => {
        // Scale trunk based on perspective
        const trunkWidth = 16 * pos.scale
        const trunkHeight = 40 * pos.scale

        // Sketchy tree trunk
        ctx.fillStyle = '#8B4513'
        ctx.strokeStyle = '#654321'
        drawSketchyRect(
          ctx,
          pos.x - trunkWidth / 2,
          pos.y,
          trunkWidth,
          trunkHeight,
        )

        // Add bark texture scaled appropriately
        ctx.strokeStyle = '#654321'
        ctx.lineWidth = Math.max(0.5, 1 * pos.scale)
        const barkLines = Math.floor(5 * pos.scale)
        for (let i = 0; i < barkLines; i++) {
          const y = pos.y + i * (trunkHeight / barkLines) + 5
          const barkWidth = trunkWidth * 0.8
          drawSketchyLine(
            ctx,
            pos.x - barkWidth / 2,
            y,
            pos.x + barkWidth / 2,
            y,
            3,
          )
        }

        // Draw sketchy pine tree foliage with triangles - scaled
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

          // Draw sketchy outline with scaled line width
          ctx.lineWidth = Math.max(1, 2 * pos.scale)
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

        // Multiple layers of pine tree triangles - all scaled
        const baseWidth = 50 * pos.scale
        const baseHeight = 30 * pos.scale

        // Adjust colors based on distance (darker for background, brighter for foreground)
        let darkGreen,
          forestGreen,
          seaGreen,
          darkStroke,
          forestStroke,
          seaStroke

        if (pos.layer === 'background') {
          darkGreen = '#003300'
          forestGreen = '#004400'
          seaGreen = '#005500'
          darkStroke = '#002200'
          forestStroke = '#003300'
          seaStroke = '#004400'
        } else if (pos.layer === 'middle') {
          darkGreen = '#004400'
          forestGreen = '#116611'
          seaGreen = '#227722'
          darkStroke = '#003300'
          forestStroke = '#004400'
          seaStroke = '#116611'
        } else {
          darkGreen = '#006400'
          forestGreen = '#228B22'
          seaGreen = '#2E8B57'
          darkStroke = '#005000'
          forestStroke = '#006400'
          seaStroke = '#228B22'
        }

        ctx.fillStyle = darkGreen
        ctx.strokeStyle = darkStroke
        drawSketchyTriangle(
          pos.x,
          pos.y - 55 * pos.scale,
          baseWidth,
          baseHeight,
        )

        ctx.fillStyle = forestGreen
        ctx.strokeStyle = forestStroke
        drawSketchyTriangle(
          pos.x,
          pos.y - 35 * pos.scale,
          baseWidth * 1.2,
          baseHeight * 1.17,
        )

        ctx.fillStyle = seaGreen
        ctx.strokeStyle = seaStroke
        drawSketchyTriangle(
          pos.x,
          pos.y - 15 * pos.scale,
          baseWidth * 1.4,
          baseHeight * 1.33,
        )

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
        // Position buildings on the right side of the screen (0.55-0.9 of width) - moved towards foreground
        const x = width * (0.55 + Math.random() * 0.35)
        // Vary the y positions for depth (0.4-0.65 of height) - moved down towards foreground
        const y = height * (0.4 + Math.random() * 0.25)
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
        // Position cabins on the left side of the screen - moved towards foreground
        const x = width * (0.05 + Math.random() * 0.25)
        const y = height * (0.45 + Math.random() * 0.25) // Moved down towards foreground
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
        for (let i = 0; i < 10; i++) {
          const puffY = chimneyY - i * 15 - 10
          const drift = Math.sin(i * 0.8 + index) * 8 + i * 3
          const puffSize = 4 + i * 2

          ctx.fillStyle = `rgba(211, 211, 211, ${0.7 - i * 0.15})`
          drawSketchyCircle(ctx, chimneyX + drift, puffY, puffSize, true, 4)
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
      const riverCenterX = width * 0.5 // River center
      const millX = riverCenterX - 120 // Left side of river (120px to the left)
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
      drawSketchyLine(
        ctx,
        millX - 8,
        millY,
        millX + millWidth / 2,
        millY - roofHeight,
        3,
      )
      drawSketchyLine(
        ctx,
        millX + millWidth / 2,
        millY - roofHeight,
        millX + millWidth + 8,
        millY,
        3,
      )

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
        drawSketchyRect(
          ctx,
          -paddleWidth / 2,
          -paddleHeight / 2,
          paddleWidth,
          paddleHeight,
        )
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
      drawSketchyCircle(
        ctx,
        doorX + doorWidth - 3,
        doorY + doorHeight / 2,
        2,
        false,
      )

      // Mill windows
      ctx.fillStyle = '#FFD700'
      const windowSize = 10
      drawSketchyRect(ctx, millX + 15, millY + 15, windowSize, windowSize)
      drawSketchyRect(
        ctx,
        millX + millWidth - 25,
        millY + 15,
        windowSize,
        windowSize,
      )

      // Window crosses
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 1
      drawSketchyLine(ctx, millX + 20, millY + 15, millX + 20, millY + 25, 2)
      drawSketchyLine(ctx, millX + 15, millY + 20, millX + 25, millY + 20, 2)
      drawSketchyLine(
        ctx,
        millX + millWidth - 20,
        millY + 15,
        millX + millWidth - 20,
        millY + 25,
        2,
      )
      drawSketchyLine(
        ctx,
        millX + millWidth - 25,
        millY + 20,
        millX + millWidth - 15,
        millY + 20,
        2,
      )
    }

    const drawBakery = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Position bakery near the mill
      const riverCenterX = width * 0.5 // River center
      const bakeryX = riverCenterX + 40 // Right side of river (40px to the right)
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
      ctx.lineTo(
        jitter(bakeryX + bakeryWidth / 2),
        jitter(bakeryY - roofHeight),
      )
      ctx.lineTo(jitter(bakeryX + bakeryWidth + 6), jitter(bakeryY))
      ctx.closePath()
      ctx.fill()

      // Roof outline
      ctx.strokeStyle = '#4A2C2A'
      ctx.lineWidth = 2
      drawSketchyLine(
        ctx,
        bakeryX - 6,
        bakeryY,
        bakeryX + bakeryWidth / 2,
        bakeryY - roofHeight,
        3,
      )
      drawSketchyLine(
        ctx,
        bakeryX + bakeryWidth / 2,
        bakeryY - roofHeight,
        bakeryX + bakeryWidth + 6,
        bakeryY,
        3,
      )

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
        drawSketchyCircle(ctx, chimneyX + drift, puffY, puffSize, true, 4)
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
      drawSketchyLine(
        ctx,
        windowX + windowWidth / 2,
        windowY,
        windowX + windowWidth / 2,
        windowY + windowHeight,
        2,
      )
      drawSketchyLine(
        ctx,
        windowX,
        windowY + windowHeight / 2,
        windowX + windowWidth,
        windowY + windowHeight / 2,
        2,
      )

      // Small window on right
      const smallWindowSize = 10
      drawSketchyRect(
        ctx,
        bakeryX + bakeryWidth - 22,
        bakeryY + 15,
        smallWindowSize,
        smallWindowSize,
      )

      // Small window cross
      drawSketchyLine(
        ctx,
        bakeryX + bakeryWidth - 17,
        bakeryY + 15,
        bakeryX + bakeryWidth - 17,
        bakeryY + 25,
        2,
      )
      drawSketchyLine(
        ctx,
        bakeryX + bakeryWidth - 22,
        bakeryY + 20,
        bakeryX + bakeryWidth - 12,
        bakeryY + 20,
        2,
      )

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
      drawSketchyLine(
        ctx,
        signX + signWidth / 2,
        bakeryY,
        signX + signWidth / 2,
        signY + signHeight,
        2,
      )

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
      drawSketchyLine(
        ctx,
        signX + signWidth / 2 - 8,
        signY,
        signX + 5,
        signY + 2,
        1,
      )
      drawSketchyLine(
        ctx,
        signX + signWidth / 2 + 8,
        signY,
        signX + signWidth - 5,
        signY + 2,
        1,
      )

      // Birthday cake display outside the bakery
      const cakeX = bakeryX
      const cakeY = bakeryY + 110
      const cakeWidth = 30
      const cakeHeight = 20

      // Cake base layer (yellow)
      ctx.fillStyle = '#FFD700' // Gold/yellow
      ctx.strokeStyle = '#FFA500' // Orange outline
      drawSketchyRect(ctx, cakeX, cakeY, cakeWidth, cakeHeight)

      // Chocolate frosting on top
      ctx.fillStyle = '#8B4513' // Chocolate brown
      drawSketchyRect(ctx, cakeX, cakeY - 3, cakeWidth, 6)

      // Cake decorative lines
      ctx.strokeStyle = '#FFA500'
      ctx.lineWidth = 1
      for (let i = 1; i < 3; i++) {
        const lineY = cakeY + (cakeHeight / 3) * i
        drawSketchyLine(ctx, cakeX, lineY, cakeX + cakeWidth, lineY, 3)
      }

      // Candles on the cake
      const candleCount = 5
      ctx.fillStyle = '#FF69B4' // Hot pink candles
      ctx.strokeStyle = '#FF1493' // Deep pink outline
      for (let i = 0; i < candleCount; i++) {
        const candleX = cakeX + 5 + i * 5
        const candleY = cakeY - 8
        const candleWidth = 2
        const candleHeight = 8

        drawSketchyRect(ctx, candleX, candleY, candleWidth, candleHeight)

        // Candle flame
        ctx.fillStyle = '#FFA500' // Orange flame
        drawSketchyCircle(ctx, candleX + 1, candleY - 2, 1.5, true)
        ctx.fillStyle = '#FFFF00' // Yellow center of flame
        drawSketchyCircle(ctx, candleX + 1, candleY - 1, 0.8, true)

        ctx.fillStyle = '#FF69B4' // Reset for next candle
      }

      // "Happy Birthday!" text in cursive
      ctx.fillStyle = '#8B4513' // Brown text
      ctx.font = 'italic bold 10px serif' // Cursive-style font
      ctx.textAlign = 'center'

      // Create a slight curve effect for the text
      const textX = cakeX + cakeWidth / 2
      const textY = cakeY + cakeHeight + 15
      // Draw the text with slight individual letter positioning for cursive effect
      const text = 'Happy Birthday!'
      ctx.fillText(text, textX, textY)

      // Add a single decorative swirl underneath the text
      ctx.strokeStyle = '#8B4513'
      ctx.lineWidth = 1

      // Single swirly shape underneath the text
      ctx.beginPath()
      ctx.moveTo(textX - 30, textY + 5)
      // Draw a decorative curvy line
      ctx.bezierCurveTo(
        textX - 15,
        textY + 1, // First control point
        textX,
        textY + 8, // Second control point
        textX + 15,
        textY + 3, // End point
      )
      ctx.bezierCurveTo(
        textX + 30,
        textY - 2, // First control point
        textX + 40,
        textY + 6, // Second control point
        textX + 30,
        textY + 8, // End point
      )
      ctx.stroke()
    }

    const drawCalicoPattern = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
    ) => {
      // Orange patches
      ctx.fillStyle = '#FF8C42'
      for (let i = 0; i < 8; i++) {
        const patchX = x + Math.random() * width * 0.8
        const patchY = y + Math.random() * height * 0.8
        const patchSize = 2 + Math.random() * 3
        drawSketchyCircle(ctx, patchX, patchY, patchSize, true)
      }

      // Black patches
      ctx.fillStyle = '#2F2F2F'
      for (let i = 0; i < 6; i++) {
        const patchX = x + Math.random() * width * 0.8
        const patchY = y + Math.random() * height * 0.8
        const patchSize = 1.5 + Math.random() * 2.5
        drawSketchyCircle(ctx, patchX, patchY, patchSize, true)
      }
    }

    const drawLargeHouse = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Position large house in bottom right
      const houseX = width * 0.75
      const houseY = height * 0.8
      const houseWidth = 120
      const houseHeight = 70

      // House main structure - stone/brick
      ctx.fillStyle = '#D2B48C' // Tan color
      ctx.strokeStyle = '#8B7355'
      drawSketchyRect(ctx, houseX, houseY, houseWidth, houseHeight)

      // Stone/brick texture
      ctx.strokeStyle = '#8B7355'
      ctx.lineWidth = 1
      for (let y = houseY + 12; y < houseY + houseHeight; y += 15) {
        drawSketchyLine(ctx, houseX, y, houseX + houseWidth, y, 8)
      }

      // Vertical mortar lines (offset pattern)
      for (let y = houseY; y < houseY + houseHeight; y += 30) {
        for (let x = houseX + 25; x < houseX + houseWidth; x += 30) {
          drawSketchyLine(ctx, x, y, x, y + 15, 2)
        }
      }
      for (let y = houseY + 15; y < houseY + houseHeight; y += 30) {
        for (let x = houseX + 10; x < houseX + houseWidth; x += 30) {
          drawSketchyLine(ctx, x, y, x, y + 15, 2)
        }
      }

      // Large roof
      ctx.fillStyle = '#8B4513'
      const roofHeight = 35
      ctx.beginPath()
      ctx.moveTo(jitter(houseX - 10), jitter(houseY))
      ctx.lineTo(jitter(houseX + houseWidth / 2), jitter(houseY - roofHeight))
      ctx.lineTo(jitter(houseX + houseWidth + 10), jitter(houseY))
      ctx.closePath()
      ctx.fill()

      // Roof outline
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 3
      drawSketchyLine(
        ctx,
        houseX - 10,
        houseY,
        houseX + houseWidth / 2,
        houseY - roofHeight,
        4,
      )
      drawSketchyLine(
        ctx,
        houseX + houseWidth / 2,
        houseY - roofHeight,
        houseX + houseWidth + 10,
        houseY,
        4,
      )

      // Chimney
      const chimneyX = houseX + houseWidth * 0.8
      const chimneyY = houseY - roofHeight - 5
      ctx.fillStyle = '#8B4513'
      drawSketchyRect(ctx, chimneyX, chimneyY, 12, 25)

      // Chimney smoke
      for (let i = 0; i < 6; i++) {
        const puffY = chimneyY - i * 15 - 10
        const drift = Math.sin(i * 0.7) * 8 + i * 4
        const puffSize = 4 + i * 2

        ctx.fillStyle = `rgba(220, 220, 220, ${0.8 - i * 0.1})`
        drawSketchyCircle(ctx, chimneyX + drift, puffY, puffSize, true, 4)
      }

      // Front door
      const doorWidth = 20
      const doorHeight = 35
      const doorX = houseX + 15
      const doorY = houseY + houseHeight - doorHeight

      ctx.fillStyle = '#654321'
      drawSketchyRect(ctx, doorX, doorY, doorWidth, doorHeight)

      // Door handle
      ctx.fillStyle = '#FFD700'
      drawSketchyCircle(
        ctx,
        doorX + doorWidth - 4,
        doorY + doorHeight / 2,
        2,
        false,
      )

      // Door panels
      ctx.strokeStyle = '#4A2C2A'
      ctx.lineWidth = 2
      drawSketchyLine(
        ctx,
        doorX + 5,
        doorY + 8,
        doorX + doorWidth - 5,
        doorY + 8,
        2,
      )
      drawSketchyLine(
        ctx,
        doorX + 5,
        doorY + doorHeight - 8,
        doorX + doorWidth - 5,
        doorY + doorHeight - 8,
        2,
      )

      // Large windows
      ctx.fillStyle = '#FFE4B5' // Warm window light

      // Left window
      const leftWindowX = houseX + 50
      const leftWindowY = houseY + 25
      const windowWidth = 25
      const windowHeight = 20
      ctx.lineWidth = 1
      drawSketchyRect(ctx, leftWindowX, leftWindowY, windowWidth, windowHeight)

      // Window cross pattern
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 1.5
      drawSketchyLine(
        ctx,
        leftWindowX + windowWidth / 2,
        leftWindowY,
        leftWindowX + windowWidth / 2,
        leftWindowY + windowHeight,
        1,
      )
      drawSketchyLine(
        ctx,
        leftWindowX,
        leftWindowY + windowHeight / 2,
        leftWindowX + windowWidth,
        leftWindowY + windowHeight / 2,
        1,
      )

      // Right window with calico cat
      const rightWindowX = houseX + 85
      const rightWindowY = houseY + 25
      drawSketchyRect(
        ctx,
        rightWindowX,
        rightWindowY,
        windowWidth,
        windowHeight,
      )

      // Window cross pattern
      drawSketchyLine(
        ctx,
        rightWindowX + windowWidth / 2,
        rightWindowY,
        rightWindowX + windowWidth / 2,
        rightWindowY + windowHeight,
        2,
        1,
      )
      drawSketchyLine(
        ctx,
        rightWindowX,
        rightWindowY + windowHeight / 2,
        rightWindowX + windowWidth,
        rightWindowY + windowHeight / 2,
        2,
        1,
      )

      // Calico cat in right window
      const catX = rightWindowX + windowWidth / 2
      const catY = rightWindowY + windowHeight / 2 + 3
      // Cat body (curled up sleeping position)
      ctx.fillStyle = '#F5F5DC' // Beige base
      ctx.beginPath()
      ctx.arc(catX, catY, 8, 0, Math.PI * 2)
      ctx.fill()

      // Add calico pattern
      drawCalicoPattern(ctx, catX - 8, catY - 8, 16, 16)

      // Cat head
      ctx.fillStyle = '#F5F5DC'
      ctx.beginPath()
      ctx.arc(catX - 3, catY - 5, 5, 0, Math.PI * 2)
      ctx.fill()

      // Add calico pattern to head
      drawCalicoPattern(ctx, catX - 8, catY - 10, 10, 10)

      // Cat ears
      ctx.fillStyle = '#F5F5DC'
      ctx.beginPath()
      ctx.moveTo(catX - 6, catY - 8)
      ctx.lineTo(catX - 4, catY - 11)
      ctx.lineTo(catX - 2, catY - 8)
      ctx.closePath()
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(catX + 1, catY - 8)
      ctx.lineTo(catX + 3, catY - 11)
      ctx.lineTo(catX + 5, catY - 8)
      ctx.closePath()
      ctx.fill()

      // Cat eyes (closed - sleeping)
      ctx.strokeStyle = '#2F2F2F'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(catX - 5, catY - 6)
      ctx.lineTo(catX - 3, catY - 6)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(catX - 1, catY - 6)
      ctx.lineTo(catX + 1, catY - 6)
      ctx.stroke()

      // Cat nose
      ctx.fillStyle = '#FFB6C1'
      ctx.beginPath()
      ctx.moveTo(catX - 1, catY - 4)
      ctx.lineTo(catX, catY - 5)
      ctx.lineTo(catX + 1, catY - 4)
      ctx.closePath()
      ctx.fill()

      // Cat tail (curled around)
      // ctx.strokeStyle = '#F5F5DC'
      // ctx.lineWidth = 1
      // ctx.beginPath()
      // ctx.arc(catX + 5, catY + 2, 6, 0, Math.PI * 1.5)
      // ctx.stroke()

      // Add orange patches to tail
      // ctx.strokeStyle = '#FF8C42'
      // ctx.lineWidth = 1
      // ctx.beginPath()
      // ctx.arc(catX + 5, catY + 2, 6, 0, Math.PI * 0.5)
      // ctx.stroke()
    }

    const drawAppleOrchard = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Position orchard on mountain slope - right side mountain, middle distance
      const orchardCenterX = width * 0.95
      const orchardCenterY = height * 0.35
      const orchardSpread = 180

      // Generate apple tree positions in a rough grid pattern
      const appleTreePositions = []
      const rows = 2
      const treesPerRow = 8

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < treesPerRow; col++) {
          const x =
            orchardCenterX -
            orchardSpread / 2 +
            (col / (treesPerRow - 1)) * orchardSpread +
            (Math.random() - 0.5) * 20
          const y = orchardCenterY + row * 15 + (Math.random() - 0.5) * 8
          const scale = 0.3 + Math.random() * 0.2 // Small trees on mountain slope
          appleTreePositions.push({ x, y, scale })
        }
      }

      // Draw apple trees
      appleTreePositions.forEach(pos => {
        // Apple tree trunk - thinner than pine trees
        const trunkWidth = 8 * pos.scale
        const trunkHeight = 25 * pos.scale

        ctx.fillStyle = '#8B4513'
        ctx.strokeStyle = '#654321'
        drawSketchyRect(
          ctx,
          pos.x - trunkWidth / 2,
          pos.y,
          trunkWidth,
          trunkHeight,
        )

        // Apple tree crown - rounded, not triangular like pines
        const crownRadius = 20 * pos.scale
        const crownY = pos.y - trunkHeight + 5

        // Main foliage mass
        ctx.fillStyle = '#228B22' // Forest green
        ctx.strokeStyle = '#006400'
        drawSketchyCircle(ctx, pos.x, crownY, crownRadius, true)

        // Add additional foliage clumps for more natural look
        const clumpCount = 3 + Math.floor(Math.random() * 3)
        for (let i = 0; i < clumpCount; i++) {
          const angle = (i / clumpCount) * Math.PI * 2 + Math.random() * 0.5
          const clumpX = pos.x + Math.cos(angle) * (crownRadius * 0.6)
          const clumpY = crownY + Math.sin(angle) * (crownRadius * 0.6)
          const clumpSize = (8 + Math.random() * 8) * pos.scale

          ctx.fillStyle = '#228B22' // Alternate greens
          drawSketchyCircle(ctx, clumpX, clumpY, clumpSize, true)
        }

        // Add apples - red dots scattered in the foliage
        const appleCount = Math.floor(12 * pos.scale + Math.random() * 8)
        ctx.fillStyle = '#DC143C' // Crimson red apples
        ctx.strokeStyle = '#DC143C' // Crimson red apples

        for (let i = 0; i < appleCount; i++) {
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * crownRadius * 0.8
          const appleX = pos.x + Math.cos(angle) * distance
          const appleY = crownY + Math.sin(angle) * distance
          const appleSize = 1 //(3 + Math.random() * 2) * pos.scale // Larger apples

          ctx.fillRect(appleX, appleY, 1, 1)

          // Add larger, more prominent highlight to apple
          // ctx.fillStyle = '#FF6B6B'
          // const highlightSize = appleSize * 0.6
          // drawSketchyCircle(
          //   ctx,
          //   appleX - highlightSize / 3,
          //   appleY - highlightSize / 3,
          //   highlightSize,
          //   true,
          // )

          // Add second smaller highlight for more dimension
          // ctx.fillStyle = '#FFB6C1'
          // const smallHighlight = appleSize * 0.3
          // drawSketchyCircle(
          //   ctx,
          //   appleX - smallHighlight / 2,
          //   appleY - smallHighlight / 2,
          //   smallHighlight,
          //   true,
          // )

          ctx.fillStyle = '#DC143C' // Reset to red for next apple
        }

        // Occasionally add some apples on the ground
        // if (Math.random() > 0.6) {
        //   const groundApples = 2 + Math.floor(Math.random() * 4)
        //   for (let i = 0; i < groundApples; i++) {
        //     const groundX = pos.x + (Math.random() - 0.5) * crownRadius * 1.5
        //     const groundY = pos.y + 2 + Math.random() * 3
        //     const groundAppleSize = (2 + Math.random() * 1) * pos.scale // Larger ground apples
        //
        //     ctx.fillStyle = '#B22222' // Darker red for ground apples
        //     drawSketchyCircle(ctx, groundX, groundY, groundAppleSize, true)
        //
        //     // Add highlight to ground apples too
        //     ctx.fillStyle = '#CD5C5C'
        //     const groundHighlight = groundAppleSize * 0.4
        //     drawSketchyCircle(
        //       ctx,
        //       groundX - groundHighlight / 2,
        //       groundY - groundHighlight / 2,
        //       groundHighlight,
        //       true,
        //     )
        //   }
        // }
      })

      // Add a small wooden sign for the orchard
      const signX = orchardCenterX - orchardSpread / 2 - 15
      const signY = orchardCenterY + 30
      const signWidth = 30
      const signHeight = 8

      // Sign post
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 2
      drawSketchyLine(
        ctx,
        signX + signWidth / 2,
        signY + signHeight,
        signX + signWidth / 2,
        signY + signHeight + 15,
        2,
      )

      // Sign board
      ctx.fillStyle = '#DEB887'
      ctx.strokeStyle = '#8B7355'
      drawSketchyRect(ctx, signX, signY, signWidth, signHeight)

      // Sign text
      ctx.fillStyle = '#654321'
      ctx.font = '6px serif'
      ctx.textAlign = 'center'
      ctx.fillText('Apple Orchard', signX + signWidth / 2, signY + 6)
    }

    const drawIceCreamShop = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
    ) => {
      // Position ice cream shop on the mountain slope - left side mountain
      const shopX = width * 0.15
      const shopY = height * 0.32 // On mountain slope
      const shopWidth = 60
      const shopHeight = 45

      // Ice cream shop building - brown wood panels
      ctx.fillStyle = '#8B4513' // Saddle brown
      ctx.strokeStyle = '#654321'
      drawSketchyRect(ctx, shopX, shopY, shopWidth, shopHeight)

      // Wood panel texture with horizontal lines
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 1
      for (let y = shopY + 8; y < shopY + shopHeight; y += 8) {
        drawSketchyLine(ctx, shopX, y, shopX + shopWidth, y, 4)
      }

      // Wood roof - darker brown
      ctx.fillStyle = '#654321'
      const roofHeight = 18
      ctx.beginPath()
      ctx.moveTo(jitter(shopX - 5), jitter(shopY))
      ctx.lineTo(jitter(shopX + shopWidth / 2), jitter(shopY - roofHeight))
      ctx.lineTo(jitter(shopX + shopWidth + 5), jitter(shopY))
      ctx.closePath()
      ctx.fill()

      // Roof outline
      ctx.strokeStyle = '#4A2C2A'
      ctx.lineWidth = 2
      drawSketchyLine(
        ctx,
        shopX - 5,
        shopY,
        shopX + shopWidth / 2,
        shopY - roofHeight,
        3,
      )
      drawSketchyLine(
        ctx,
        shopX + shopWidth / 2,
        shopY - roofHeight,
        shopX + shopWidth + 5,
        shopY,
        3,
      )

      // Ice cream cone decoration on roof
      const coneX = shopX + shopWidth / 2
      const coneY = shopY - roofHeight / 2

      // Cone
      ctx.fillStyle = '#DEB887'
      ctx.beginPath()
      ctx.moveTo(jitter(coneX - 4), jitter(coneY + 5))
      ctx.lineTo(jitter(coneX + 4), jitter(coneY + 5))
      ctx.lineTo(jitter(coneX), jitter(coneY + 12))
      ctx.closePath()
      ctx.fill()

      // Ice cream scoops
      ctx.fillStyle = '#FFB6C1' // Pink scoop
      drawSketchyCircle(ctx, coneX, coneY + 2, 3, true)
      ctx.fillStyle = '#FFFACD' // Lemon chiffon scoop
      drawSketchyCircle(ctx, coneX, coneY - 1, 3, true)

      // Shop window
      ctx.fillStyle = '#FFE4B5' // Warm window light
      const windowWidth = 20
      const windowHeight = 15
      const windowX = shopX + 8
      const windowY = shopY + 12
      drawSketchyRect(ctx, windowX, windowY, windowWidth, windowHeight)

      // Window cross pattern
      ctx.strokeStyle = '#654321'
      ctx.lineWidth = 1
      drawSketchyLine(
        ctx,
        windowX + windowWidth / 2,
        windowY,
        windowX + windowWidth / 2,
        windowY + windowHeight,
        2,
      )
      drawSketchyLine(
        ctx,
        windowX,
        windowY + windowHeight / 2,
        windowX + windowWidth,
        windowY + windowHeight / 2,
        2,
      )

      // Door
      const doorWidth = 12
      const doorHeight = 20
      const doorX = shopX + shopWidth - doorWidth - 5
      const doorY = shopY + shopHeight - doorHeight

      ctx.fillStyle = '#8B4513' // Brown wood door
      drawSketchyRect(ctx, doorX, doorY, doorWidth, doorHeight)

      // Door handle
      ctx.fillStyle = '#FFD700'
      drawSketchyCircle(ctx, doorX + 3, doorY + doorHeight / 2, 1.5, false)

      // Sign for "Maple Ice Cream"
      const signX = shopX + shopWidth / 2 - 30
      const signY = shopY - 8
      const signWidth = 60
      const signHeight = 10

      // Sign board
      ctx.fillStyle = '#DEB887' // Burlywood
      ctx.strokeStyle = '#8B7355'
      drawSketchyRect(ctx, signX, signY, signWidth, signHeight)

      // Sign text "Maple Ice Cream"
      ctx.fillStyle = '#8B4513'
      ctx.font = 'bold 8px serif'
      ctx.textAlign = 'center'
      ctx.fillText('Maple Ice Cream', signX + signWidth / 2, signY + 7)

      // Add decorative ice cream cone signs on either side
      // Left cone
      const leftConeX = signX - 8
      const leftConeY = signY + 5
      ctx.fillStyle = '#DEB887'
      ctx.beginPath()
      ctx.moveTo(jitter(leftConeX - 2), jitter(leftConeY))
      ctx.lineTo(jitter(leftConeX + 2), jitter(leftConeY))
      ctx.lineTo(jitter(leftConeX), jitter(leftConeY + 6))
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#FFB6C1'
      drawSketchyCircle(ctx, leftConeX, leftConeY - 2, 2, true)

      // Right cone
      const rightConeX = signX + signWidth + 8
      const rightConeY = signY + 5
      ctx.fillStyle = '#DEB887'
      ctx.beginPath()
      ctx.moveTo(jitter(rightConeX - 2), jitter(rightConeY))
      ctx.lineTo(jitter(rightConeX + 2), jitter(rightConeY))
      ctx.lineTo(jitter(rightConeX), jitter(rightConeY + 6))
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = '#FFFACD'
      drawSketchyCircle(ctx, rightConeX, rightConeY - 2, 2, true)

      // Large sign post with ice cream cone outside the building
      const signPostX = shopX - 30
      const signPostY = shopY + shopHeight + 5
      const postHeight = 75
      const signBoardWidth = 48
      const signBoardHeight = 36

      // Sign post
      ctx.fillStyle = '#8B4513'
      ctx.strokeStyle = '#654321'
      drawSketchyRect(ctx, signPostX, signPostY, 9, postHeight)

      // Sign board
      ctx.fillStyle = '#DEB887' // Burlywood
      ctx.strokeStyle = '#8B7355'
      ctx.lineWidth = 2
      drawSketchyRect(
        ctx,
        signPostX - signBoardWidth / 2 + 4.5,
        signPostY - 15,
        signBoardWidth,
        signBoardHeight,
      )

      // Ice cream cone on the sign
      const coneSignX = signPostX + 4.5
      const coneSignY = signPostY + 6

      // Cone
      ctx.fillStyle = '#DEB887'
      ctx.beginPath()
      ctx.moveTo(jitter(coneSignX - 9), jitter(coneSignY))
      ctx.lineTo(jitter(coneSignX + 9), jitter(coneSignY))
      ctx.lineTo(jitter(coneSignX), jitter(coneSignY + 24))
      ctx.closePath()
      ctx.fill()

      // Waffle pattern on cone
      ctx.strokeStyle = '#CD853F'
      ctx.lineWidth = 1.5
      for (let i = 0; i < 5; i++) {
        const lineY = coneSignY + i * 4 + 2
        drawSketchyLine(ctx, coneSignX - 6, lineY, coneSignX + 6, lineY, 2)
      }
      for (let i = 0; i < 4; i++) {
        const lineX = coneSignX - 6 + i * 3
        drawSketchyLine(ctx, lineX, coneSignY, lineX, coneSignY + 18, 2)
      }

      // Ice cream scoops on sign
      ctx.fillStyle = '#FFB6C1' // Pink scoop
      drawSketchyCircle(ctx, coneSignX, coneSignY - 6, 7.5, true)
      ctx.fillStyle = '#FFFACD' // Vanilla scoop
      drawSketchyCircle(ctx, coneSignX, coneSignY - 15, 7.5, true)
      ctx.fillStyle = '#DDA0DD' // Purple scoop (maple flavor)
      drawSketchyCircle(ctx, coneSignX, coneSignY - 24, 7.5, true)

      // Cherry on top
      ctx.fillStyle = '#DC143C'
      drawSketchyCircle(ctx, coneSignX, coneSignY - 30, 3, true)
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
