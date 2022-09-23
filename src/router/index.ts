import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { ERouterName } from '/@/types/index'
import CreatePlan from '../pages/page-web/projects/create-plan.vue'
import WaylinePanel from '/@/pages/page-web/projects/wayline.vue'
import DockPanel from '/@/pages/page-web/projects/dock.vue'
import LiveAgora from '/@/components/livestream-agora.vue'
import LiveOthers from '/@/components/livestream-others.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/' + ERouterName.PROJECT
  },
  // 首页
  {
    path: '/' + ERouterName.PROJECT,
    name: ERouterName.PROJECT,
    component: () => import('/@/pages/page-web/index.vue')
  },
  // members, devices
  {
    path: '/' + ERouterName.HOME,
    name: ERouterName.HOME,
    component: () => import('/@/pages/page-web/home.vue'),
    children: [
      {
        path: '/' + ERouterName.MEMBERS,
        name: ERouterName.MEMBERS,
        component: () => import('/@/pages/page-web/projects/members.vue')
      },
      {
        path: '/' + ERouterName.DEVICES,
        name: ERouterName.DEVICES,
        component: () => import('/@/pages/page-web/projects/devices.vue')
      }
    ]
  },
  // workspace
  {
    path: '/' + ERouterName.WORKSPACE,
    name: ERouterName.WORKSPACE,
    component: () => import('/@/pages/page-web/projects/workspace.vue'),
    redirect: '/' + ERouterName.TSA,
    children: [
      {
        path: '/' + ERouterName.LIVESTREAM,
        name: ERouterName.LIVESTREAM,
        component: () => import('/@/pages/page-web/projects/livestream.vue'),
        children: [
          {
            path: ERouterName.LIVING,
            name: ERouterName.LIVING,
            components: {
              LiveAgora,
              LiveOthers
            }
          }
        ]
      },
      {
        path: '/' + ERouterName.TSA,
        component: () => import('/@/pages/page-web/projects/tsa.vue')
      },
      {
        path: '/' + ERouterName.LAYER,
        name: ERouterName.LAYER,
        component: () => import('/@/pages/page-web/projects/layer.vue')
      },
      {
        path: '/' + ERouterName.MEDIA,
        name: ERouterName.MEDIA,
        component: () => import('/@/pages/page-web/projects/media.vue')
      },
      {
        path: '/' + ERouterName.WAYLINE,
        name: ERouterName.WAYLINE,
        component: () => import('/@/pages/page-web/projects/wayline.vue')
      },
      {
        path: '/' + ERouterName.TASK,
        name: ERouterName.TASK,
        component: () => import('/@/pages/page-web/projects/task.vue'),
        children: [
          {
            path: ERouterName.CREATE_PLAN,
            name: ERouterName.CREATE_PLAN,
            component: CreatePlan,
            children: [
              {
                path: ERouterName.SELECT_PLAN,
                name: ERouterName.SELECT_PLAN,
                components: {
                  WaylinePanel,
                  DockPanel
                }
              }
            ]
          }

        ]
      }
    ]
  },
  // pilot
  {
    path: '/' + ERouterName.PILOT,
    name: ERouterName.PILOT,
    component: () => import('/@/pages/page-pilot/pilot-index.vue'),
  },
  {
    path: '/' + ERouterName.PILOT_HOME,
    component: () => import('/@/pages/page-pilot/pilot-home.vue')
  },
  {
    path: '/' + ERouterName.PILOT_MEDIA,
    component: () => import('/@/pages/page-pilot/pilot-media.vue')
  },
  {
    path: '/' + ERouterName.PILOT_LIVESHARE,
    component: () => import('/@/pages/page-pilot/pilot-liveshare.vue')
  },
  {
    path: '/' + ERouterName.PILOT_BIND,
    component: () => import('/@/pages/page-pilot/pilot-bind.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
