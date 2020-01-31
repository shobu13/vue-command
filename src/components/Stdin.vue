<template>
  <div
    v-show="!isFullscreen && (!isLast || !isInProgress)"
    class="stdin-container">
    <span
      v-if="!hidePrompt"
      class="term-ps"
      v-html="prompt">
    </span>
    <span class="term-stdin">
      <textarea
        ref="input"
        v-model="command"
        :autofocus="isLast"
        :disabled="!isLast || isInProgress"
        :placeholder="placeholder"
        autocapitalize="none"
        style="resize: none; word-break: break-all"
        @click="emitCursor"
        @keyup="emitCursor"
        @keyup.enter="handle"
        @keydown.enter.prevent
        @input="onInput"/>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    bus: {
      type: Object,
      required: true
    },

    helpText: {
      type: String
    },

    helpTimeout: {
      type: Number
    },

    hidePrompt: {
      type: Boolean,
      default: false
    },

    isInProgress: {
      type: Boolean,
      default: false
    },

    isLast: {
      type: Boolean,
      required: true
    },

    lastCommand: {
      type: String,
      default: ''
    },

    isFullscreen: {
      type: Boolean,
      required: true
    },

    prompt: {
      type: String
    },

    showHelp: {
      type: Boolean,
      default: false
    },

    uid: {
      type: Number,
      required: true
    },
    current: {
      type: String,
      require: true
    }
  },

  data: function () {
    return {
      command: this.$props.current,
      // For virtual path simulation
      localPrompt: '',
      placeholder: ''
    }
  },

  watch: {
    lastCommand () {
      if (this.lastCommand && this.isLast) {
        this.setCommand(this.lastCommand)
      }
    },

    command () {
      // Emit current command as event
      this.$emit('typing', this.command)
      // Emit current cursor position
      this.$emit('cursor', this.$refs.input.selectionStart)
    },

    async isInProgress () {
      if (!this.isInProgress && this.isLast) {
        await this.$nextTick()

        this.$refs.input.scrollIntoView()
        this.$refs.input.focus()
      }

      if (this.isInProgress && !this.isLast) {
        this.$refs.input.blur()
      }
    }
  },

  created () {
    setTimeout(() => {
      if (this.isLast && this.showHelp) {
        this.setPlaceholder(this.helpText)
      }
    }, this.helpTimeout)
  },

  mounted () {
    // Scroll to current input and focus it
    this.$refs.input.scrollIntoView()
    this.$refs.input.focus()

    const onAutocomplete = ({ command, uid }) => {
      if (this.isLast && this.uid === uid) {
        this.setCommand(command)
      }
    }

    const onSetCommand = command => {
      if (this.isLast) {
        this.setCommand(command)
      }
    }

    this.bus.$on('autocomplete', onAutocomplete)
    this.bus.$on('setCommand', onSetCommand)
  },

  methods: {
    // Handle current command
    handle (event) {
      // Wait for other commands to finish
      if (this.isInProgress) {
        return
      }

      // Persist the current prompt
      this.setLocalPrompt(this.prompt)
      // Request to handle the current command
      this.$emit('handle', this.command)
      this.setPlaceholder('')
    },

    // Emits the current cursor position
    emitCursor () {
      this.$emit('cursor', this.$refs.input.selectionStart)
    },

    setPlaceholder (placeholder) {
      this.placeholder = placeholder
    },

    setCommand (command) {
      this.command = command
    },

    setLocalPrompt (localPrompt) {
      this.localPrompt = localPrompt
    },
    onInput (event) {
      let textarea = event.target

      textarea.style.height = '' /* Reset the height */
      textarea.style.height = textarea.scrollHeight + 'px'
    }
  }
}
</script>

<style lang="scss">
@import "../scss/mixins";

.vue-command {
  display: flex;

  .stdin-container {
    display: flex;
  }

  input,
  textarea {
    background: none;
    border: none;
    font-size: inherit;
    outline: none;
    flex: 1;
    width: 100%;

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  .term-stdin {
    flex: 1;
    background: none;
    margin: 0;
    margin-left: 0.5rem;
    border: 0;
  }
}
</style>
