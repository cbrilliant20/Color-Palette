// Global Variables
const colorDivs = document.querySelectorAll(".color")
const generateButton = document.querySelector(".generate")
const sliders = document.querySelectorAll('input[type="range"]')
const currentHexes = document.querySelectorAll(".color h2")
let initialColors

// Functions

function generateHex() {
  // Chroma JS
  const hexColor = chroma.random()
  return hexColor
}

function randomColors() {
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0]
    const randomColor = generateHex()
    // Add to background
    div.style.backgroundColor = randomColor
    hexText.innerText = randomColor
    // Check for contrast
    checkTextContrast(randomColor, hexText)
    // Initial Colorize sliders
    const color = chroma(randomColor)
    const sliders = div.querySelectorAll(".sliders input")
    const hue = sliders[0]
    const brightness = sliders[1]
    const saturation = sliders[2]

    colorizeSliders(color, hue, brightness, saturation)
  })
}

function checkTextContrast(color, text) {
  const luminance = chroma(color).luminance()
  if (luminance > 0.5) {
    text.style.color = "black"
  } else {
    text.style.color = "white"
  }
}

function colorizeSliders(color, hue, brightness, saturation) {
  // Hue Scale

  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75), rgb(204,204,75), rgb(75,204,75), rgb(75,204,204), rgb(75,75,204), rgb(204,75,204), rgb(204,75,75))`

  // Brightness Scale
  const midBright = color.set("hsl.l", 0.5)
  const scaleBright = chroma.scale(["black", midBright, "white"])
  brightness.style.backgroundImage = `linear-gradient(to right, ${scaleBright(
    0
  )}, ${scaleBright(0.5)}, ${scaleBright(1)})`

  // Saturation Scale
  const noSat = color.set("hsl.s", 0)
  const fullSat = color.set("hsl.s", 1)
  const scaleSat = chroma.scale([noSat, color, fullSat])
  saturation.style.backgroundImage = `linear-gradient(to right, ${scaleSat(
    0
  )}, ${scaleSat(1)})`
}

randomColors()

// Event Listeners
