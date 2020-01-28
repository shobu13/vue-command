<template>
  <main>
    <h1><a href="https://github.com/ndabAP/vue-command">vue-command</a></h1>
    <p>A fully working Vue.js terminal emulator.</p>

    <vue-command
      :help-timeout="1250"
      :commands="commands"
      show-help
      :autocompletion-resolver="autocompletionResolver"/>
    <pre>
      <code>
$ npm i --save vue-command
      </code>
    </pre>
  </main>
</template>

<script>
import VueCommand from '../components/VueCommand'
import yargsParser from 'yargs-parser'
/* import loading from './LoadingAnimation'
import nano from './NanoEditor'
import klieh from './KliehParty' */

export default {
  components: {
    VueCommand
  },

  data: function () {
    return {
      commands: {
        help: {
          command: ({ _ }) => {
            if (_[1]) {
              let program = _[1]

              const command = this.commands[program]
              return command ? command.helpText : `provided command <b>${program}</b> not found`
            } else {
              return `Available programms:<br><br>

                      &nbsp;klieh<br>
                      &nbsp;loading [--timeout n] [--amount n]<br>
                      &nbsp;nano<br>
                      &nbsp;pokedex pokemon --color<br>
                    `
            }
          },
          resolver: (command) => {
            let commands = Object.keys(this.commands)
            let index = command.length - 1
            let argument = command[index]

            let candidates = commands.filter(c => c.startsWith(argument)) || argument
            if (index > 1) { return '' }
            if (index === 0) { console.log('undefined'); return commands }
            if (candidates.length === 0) { return argument }
            if (candidates.length > 1) { return candidates }
            return candidates[0]
          },
          helpText:
          `
        Syntax: help [command] <br/>
        return a general help message for each command provided
        `
        },
        cd: {},
        cat: {}

        /* pokedex: ({ color, _ }) => {
        if (color && _[1] === 'pikachu') {
          return 'yellow'
        }

        // Return help since no match
        return `Usage: pokedex pokemon [option]<br><br>

          Example: pokedex pikachu --color
        `
      },

      klieh: () => klieh,
      loading: () => loading,
      nano: () => nano */
      }
    }
  },
  methods: {
    autocompletionResolver: function (current, cursor) {
      const { _ } = yargsParser(current, this.yargsOptions)
      let commands = Object.keys(this.commands)

      let candidates = commands.filter(c => c.startsWith(_[0])) || _[0]
      if (candidates.length === 0) { return _[0] }
      if (candidates.length > 1) { return candidates }
      let command = candidates[0]
      if (_[0].trim() === command) {
        let resolvedArgument = this.commands[command].resolver(_)
        if (Array.isArray(resolvedArgument)) { return resolvedArgument }
        return _.slice(0, _.length - 1).join(' ') + ' ' + resolvedArgument
      }
      return command
    }
  }
}
</script>

<style lang="scss">
$border-radius: 8px;

body {
  display: grid;
  place-items: center;
  height: 95vh;
  margin: 0;

  main {
    margin: 1rem;
    max-width: 400px;
    width: calc(100% - 2rem);
  }

  h1,
  h2,
  h3 {
    font-family: "Inconsolata", monospace;
  }

  p {
    font-family: "Montserrat", sans-serif;
  }

  pre {
    width: 100%;
    padding: 0;
    margin-top: 1em;
    overflow: auto;
    overflow-y: hidden;

    code {
      padding: 10px;
      color: #333;
      margin: 5px;
    }
  }

  .vue-command {
    border-radius: $border-radius;

    .term {
      -webkit-border-radius: $border-radius;
      -moz-border-radius: $border-radius;
      border-radius: $border-radius;
    }

    .term-std {
      min-height: 300px;
      max-height: 300px;
      overflow-y: scroll;
    }
  }
}
</style>
