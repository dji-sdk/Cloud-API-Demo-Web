import { App, DefineComponent } from 'vue'

const components: Record<string, DefineComponent<{}, {}, any>> = {

}

export const CommonComponents = {
  install (app: App): void {
    Object.keys(components).forEach(name => {
      app.component(name, components[name])
    })
  }
}
