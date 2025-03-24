import type { RouteRecordRaw } from 'vue-router';

import { VBEN_LOGO_URL } from '@vben/constants';

import { BasicLayout } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
    {
        component: BasicLayout,
        meta: {
            icon: 'mdi:home',
            title: $t('page.dashboard.three'),
        },
        name: 'Home',
        path: '/home',
        redirect: '/home/index',
        children: [
            {
                name: 'HomeIndex',
                path: '/home/index',
                component: () => import('#/views/home/index.vue'),
                meta: {
                    icon: 'mdi:home',
                    title: $t('page.three.three'),
                },
            },
        ],
    },
];

export default routes;