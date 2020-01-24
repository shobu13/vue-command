// @vue/component
export default {
  data: () => ({
    // Current cursor position at STDIN
    cursor: 0
  }),

  methods: {
    // Calls the user given autocompletion resolver and sets the input accordingly
    autocomplete () {
      if (this.current && typeof this.autocompletionResolver === 'function') {
        const autocomplete = this.autocompletionResolver(this.current, this.cursor)

        if (Array.isArray(autocomplete)) {
          let trContent = []
          while (autocomplete.length) {
            trContent.push(autocomplete.splice(0, 10))
          }
          trContent = trContent.map(tr => `<tr>${tr.map(td => `<td>${td}</td>`).join('')}</tr>`).join('')
          let component = getComponent(`<table style="border-spacing: ${this.$props.autocompleteSpacing}">${trContent}</table>`)
          if (!hasOwnProperty.call(component, 'mixins')) {
            component.mixins = []
          }
          component.mixins.push({
            // Add helper methods
            methods: {
              $_done: () => {
              },

              $_setIsFullscreen: isFullscreen => {
              },

              $_executeCommand: async command => {
              }
            }
          })
          this.history.push({ stdout: component, prompt: this.prompt })
          this.setCurrent(this.current)
        } else {
          this.bus.$emit('autocomplete', { command: autocomplete, uid: this._uid })
        }
      }
    },

    setCursor (cursor) {
      this.cursor = cursor
    }
  }
}

// Returns a component containing a span element with given inner content
const getComponent = (content, isEscapeHtml) => ({
  render: h => {
    if (isEscapeHtml) {
      return h('span', {}, content)
    }

    return h('span', { domProps: { innerHTML: content } })
  },

  mounted () {
    this.$_done()
  }
})
