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
  initialColors = []

  colorDivs.forEach((div, index) => {
    const hexText = div.children[0]
    const randomColor = generateHex()
    initialColors.push(chroma(randomColor).hex())
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
  //Reset Inputs
  resetInputs()
}
randomColors()

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

function hslControls(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue")
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]')
  const hue = sliders[0]
  const brightness = sliders[1]
  const saturation = sliders[2]
  const bgColor = initialColors[index]
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", brightness.value)
    .set("hsl.h", hue.value)
  colorDivs[index].style.backgroundColor = color
  //Colorize Inputs
  colorizeSliders(color, hue, brightness, saturation)
}

function updateTextUI(index) {
  const activeDiv = colorDivs[index]
  const color = chroma(activeDiv.style.backgroundColor)
  const textHex = activeDiv.querySelector("h2")
  const icons = activeDiv.querySelectorAll(".controls button")
  textHex.innerText = color.hex()
  checkTextContrast(color, textHex)
  for (icon of icons) {
    checkTextContrast(color, icon)
  }
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input")
  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = initialColors[slider.getAttribute("data-hue")]
      const hueValue = chroma(hueColor).hsl()[0]
      slider.value = hueValue
    }
    if (slider.name === "saturation") {
      const satColor = initialColors[slider.getAttribute("data-sat")]
      const satValue = chroma(satColor).hsl()[1]
      slider.value = satValue
    }
    if (slider.name === "brightness") {
      const brightColor = initialColors[slider.getAttribute("data-bright")]
      const brightValue = chroma(brightColor).hsl()[2]
      slider.value = brightValue
    }
  })
}

// Event Listeners
sliders.forEach((slider) => {
  slider.addEventListener("input", hslControls)
})

colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUI(index)
  })
})
