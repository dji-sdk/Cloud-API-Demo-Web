import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ERouterName } from '/@/types/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/' + ERouterName.Project,
    name: ERouterName.Project,
    // redirect: {
    //   name: ERouterName.Project
    // },
    component: () => import('/@/pages/project-app/index.vue'),
    children: [
      {
        path: '/' + ERouterName.Livestream,
        component: () => import('/@/pages/project-app/projects/livestream.vue')
      },
      {
        path: '/' + ERouterName.Tsa,
        component: () => import('/@/pages/project-app/projects/tsa.vue')
      },
      {
        path: '/' + ERouterName.Layer,
        name: ERouterName.Layer,
        component: () => import('/@/pages/project-app/projects/layer.vue')
      },
      {
        path: '/' + ERouterName.Media,
        name: ERouterName.Media,
        component: () => import('/@/pages/project-app/projects/media.vue')
      },
      {
        path: '/' + ERouterName.Wayline,
        name: ERouterName.Wayline,
        component: () => import('/@/pages/project-app/projects/wayline.vue')
      },
    ]
  },
  {
    path: '/' + ERouterName.Pilot,
    name: ERouterName.Pilot,
    component: () => import('/@/pages/page-pilot/pilot-index.vue'),
    children: [

    ]
  },
  {
    path: '/' + ERouterName.PilotHome,
    component: () => import('/@/pages/page-pilot/pilot-home.vue')
  },
  {
    path: '/' + ERouterName.PilotMedia,
    component: () => import('/@/pages/page-pilot/pilot-media.vue')
  },
  {
    path: '/' + ERouterName.PilotLiveshare,
    component: () => import('/@/pages/page-pilot/pilot-liveshare.vue')
  },
  {
    path: '/' + ERouterName.Element,
    name: ERouterName.Element,
    component: () => import('/@/pages/elements/elements.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
