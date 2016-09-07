/**
 * Created by mihelcic on 02. 09. 2016.
 */

console.log('main2')

// Helper function that doubles the Animation Frame callback, as mobile devices can
// sometimes skip a frame
function requestAnimationFrameLong(callback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(callback)
  })
}

class Strips {
  constructor() {
    this.color = '#C62828'
    this.colorPicker = document.querySelector('.toolbar__color-picker')
    this.colorIndicator = this.colorPicker.querySelector('.color-picker__color')
    this.content = document.querySelector('.content')
    this.strips = this.content.querySelectorAll('.color-strip')
    this.animating = false

    // Binds
    this._addEventListeners = this._addEventListeners.bind(this)
    this._setTransitionListeners = this._setTransitionListeners.bind(this)
    this._shadeColor = this._shadeColor.bind(this)
    this.colorize = this.colorize.bind(this)


    // Init
    this._addEventListeners()
    this.colorize()
  }

  _addEventListeners() {
    // Only support two colors for demonstration
    this.colorPicker.addEventListener('click', () => {
      if(this.color === '#C62828') {
        this.color = '#2196F3'
        this.colorIndicator.style.background = '#C62828'
      }
      else {
        this.color = '#C62828'
        this.colorIndicator.style.background = '#2196F3'
      }
      this.colorize()
    })

    // Transition end listeners
    this._setTransitionListeners()

    // Listen for strip clicks / taps
    this.content.addEventListener('click', (event) => {
      if(this.animating) {
        return
      }

      let target = event.target
      if(target.classList.contains('layer-2')) {
        let parent = target.parentNode

        parent.querySelector('.layer-0').style.display = 'flex'
        parent.querySelector('.layer-1').style.display = 'flex'
        this.animating = true

        requestAnimationFrameLong(() => {
          if(parent.classList.contains('wriggle')) {
            parent.classList.remove('wriggle')
          }
          else {
            let previous = this.content.querySelector('.wriggle')
            if(previous) previous.classList.remove('wriggle')
            parent.classList.add('wriggle')
          }
        })
      }
    })
  }

  // Private
  _setTransitionListeners() {
    for(let i=0,l=this.strips.length; i<l; i++) {
      this.strips[i].querySelector('.segment-dark').addEventListener('transitionend', (event) => {
        this.animating = false

        let parent = event.target.parentNode.parentNode
        // If we de-wriggled the strip, hide unseen layers
        if(!parent.classList.contains('wriggle')) {
          parent.querySelector('.layer-0').style.display = 'none'
          parent.querySelector('.layer-1').style.display = 'none'
        }

        //console.log(event)
      })
    }
  }

  _shadeColor(color, percent) {
    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R<255)?R:255;
    G = (G<255)?G:255;
    B = (B<255)?B:255;

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
  }

  // Public
  colorize(color) {
    let step = 0
        color = color || this.color


    for(let i=0,l=this.strips.length; i<l; i++) {
      setTimeout((function(step) {

        let shadedColor = this._shadeColor(color, step)
        let segments = this.strips[i].querySelectorAll('.segment')

        this.strips[i].querySelector('.layer-0').textContent = shadedColor
        this.strips[i].style.color = shadedColor
        for(let j=0,k=segments.length; j<k; j++) {
          segments[j].style.background = shadedColor
          // The dark segment
          if(j === 1) {
            segments[j].style.background = this._shadeColor(shadedColor, -25)
          }
        }

      }).bind(this, step), i*100)
      step -= 15
    }
  }

}

const strips = new Strips()
