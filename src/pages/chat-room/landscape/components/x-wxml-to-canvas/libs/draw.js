const {
	drawImageByMode
} = require('./utils');
class Draw {
	constructor(canvas, ctx, useCORS) {
		this.canvas = canvas
		this.ctx = ctx
		this.useCORS = useCORS
	}

	roundRect(x, y, w, h, r, fill = true, stroke = false) {
		if (r < 0) return
		const ctx = this.ctx

		ctx.beginPath()
		ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 3 / 2)
		ctx.arc(x + w - r, y + r, r, Math.PI * 3 / 2, 0)
		ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2)
		ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI)
		ctx.lineTo(x, y + r)
		if (stroke) ctx.stroke()
		if (fill) ctx.fill()
	}

	drawView(box, style) {
		const ctx = this.ctx
		const {
			left: x,
			top: y,
			width: w,
			height: h
		} = box
		const {
			borderRadius = 0,
      borderWidth = 0,
      borderColor,
      color = '#000',
      backgroundColor = 'transparent'
		} = style
		ctx.save()
		// 外环
		if (borderWidth > 0) {
			ctx.fillStyle = borderColor || color
			this.roundRect(x, y, w, h, borderRadius)
		}
		// 内环
		ctx.fillStyle = backgroundColor
		const innerWidth = w - 2 * borderWidth
		const innerHeight = h - 2 * borderWidth
		const innerRadius = borderRadius - borderWidth >= 0 ? borderRadius - borderWidth : 0
		this.roundRect(x + borderWidth, y + borderWidth, innerWidth, innerHeight, innerRadius)
		ctx.restore()
	}

	async drawImage(img, box, style) {

		await new Promise((resolve, reject) => {
			const ctx = this.ctx;
			const canvas = this.canvas;
			const useCORS = this.useCORS;
			const _this = this;
			const {
				borderRadius = 0
			} = style
			const {
				left: x,
				top: y,
				width: w,
				height: h,
				sx = 0,
				sy = 0,
				sw = 0,
				sh = 0,
				isMode = false
			} = box
			let createImage = null;
			ctx.save()
			this.roundRect(x, y, w, h, borderRadius, false, false)
			ctx.clip()
			// #ifdef H5
			createImage = new Image();
			if (useCORS) {
				createImage.crossOrigin = 'anonymous';
			}
			// #endif
			// #ifdef MP
			createImage = canvas.createImage();
			// #endif	
			// #ifdef APP-PLUS
			uni.getImageInfo({
				src: img,
			}).then(res => {
				if (res[1].errMsg == 'getImageInfo:ok') {
					createImage = res[1].path;
					if (isMode) {
						ctx.drawImage(createImage, sx, sy, sw, sh, x, y, w, h)
					} else {
						ctx.drawImage(createImage, x, y, w, h)
					}
					ctx.scale(0.5, 0.5);
					ctx.restore();
					ctx.draw(true)
					resolve()
				} else {
					reject()
				}
			})
			// #endif
			// #ifdef H5 || MP
			createImage.onload = (res) => {
				if (isMode) {
					ctx.drawImage(createImage, sx, sy, sw, sh, x, y, w, h)
				} else {
					ctx.drawImage(createImage, x, y, w, h)
				}
				ctx.restore()
				resolve()
			}
			createImage.onerror = (err) => {
				reject()
			}
			createImage.src = img;
			// #endif
		})
	}

	// eslint-disable-next-line complexity
	drawText(text, box, style) {
		const ctx = this.ctx
		let {
			left: x,
			top: y,
			width: w,
			height: h
		} = box
		let {
			color = '#000',
      lineHeight = '1.4em',
      fontSize = 14,
      textAlign = 'left',
      verticalAlign = 'top',
      backgroundColor = 'transparent',
      fontFamily = 'sans-serif',
      fontWeight = 'normal'
		} = style


		if (!text || (lineHeight > h)) return

		ctx.save()
		if (lineHeight) { // 2em
			lineHeight = Math.ceil(parseFloat(lineHeight.replace('em')) * fontSize)
		}
		ctx.textBaseline = 'top'
		ctx.font = `normal ${fontSize}px ${fontFamily}`
		ctx.textAlign = textAlign
    // 未定义text宽度时，使用渲染宽度
    const textWidth = ctx.measureText(text).width
    if (!w) {
      w = textWidth
    }

		// 背景色
		ctx.fillStyle = backgroundColor
		this.roundRect(x, y, w, h, 0)

		// 文字颜色
		ctx.fillStyle = color

		// 水平布局
		switch (textAlign) {
			case 'left':
				break
			case 'center':
				x += 0.5 * w
				break
			case 'right':
				x += w
				break
			default:
				break
		}

		// const textWidth = ctx.measureText(text).width
		const actualHeight = Math.ceil(textWidth / w) * lineHeight
		let paddingTop = Math.ceil((h - actualHeight) / 2)
		if (paddingTop < 0) paddingTop = 0

		// 垂直布局
		switch (verticalAlign) {
			case 'top':
				break
			case 'middle':
				y += paddingTop
				break
			case 'bottom':
				y += 2 * paddingTop
				break
			default:
				break
		}

		const inlinePaddingTop = Math.ceil((lineHeight - fontSize) / 2)

		// 不超过一行
		if (textWidth <= w) {
			ctx.fillText(text, x, y + inlinePaddingTop)
			return
		}

		// 多行文本
		const chars = text.split('')
		const _y = y

		// 逐行绘制
		let line = ''
		for (const ch of chars) {
			const testLine = line + ch
			const testWidth = ctx.measureText(testLine).width

			if (testWidth > w) {
				ctx.fillText(line, x, y + inlinePaddingTop)
				y += lineHeight
				line = ch
				if ((y + lineHeight) > (_y + h)) break
			} else {
				line = testLine
			}
		}

		// 避免溢出
		if ((y + lineHeight) <= (_y + h)) {
			ctx.fillText(line, x, y + inlinePaddingTop)
		}
		ctx.restore()
	}

	async drawNode(element) {
		let {
			layoutBox,
			computedStyle,
			name
		} = element
		let {
			src,
			text,
			mode = 'aspectFit',
			isMode = false
		} = element.attributes
		if (name === 'view') {
			this.drawView(layoutBox, computedStyle)
		} else if (name === 'image') {
			if (isMode) {
				const {
					width,
					height,
					left,
					top
				} = layoutBox;
				layoutBox = await drawImageByMode(src, mode, width, height, top, left);
			}
			// console.log('layoutBox', layoutBox)
			await this.drawImage(src, layoutBox, computedStyle)
		} else if (name === 'text') {
			this.drawText(text, layoutBox, computedStyle)
		}
		const childs = Object.values(element.children)
		for (const child of childs) {
			await this.drawNode(child)
		}
	}
}


module.exports = {
	Draw
}
