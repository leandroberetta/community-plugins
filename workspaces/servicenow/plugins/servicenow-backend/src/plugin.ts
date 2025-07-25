/*
 * Copyright 2025 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { createRouter } from './service';
import { readServiceNowConfig } from './config';
import { ServiceNowConfig } from '../config';

/**
 * servicenowPlugin backend plugin
 *
 * @public
 */
export const servicenowPlugin = createBackendPlugin({
  pluginId: 'servicenow',
  register(env) {
    env.registerInit({
      deps: {
        logger: coreServices.logger,
        config: coreServices.rootConfig,
        httpRouter: coreServices.httpRouter,
        httpAuth: coreServices.httpAuth,
      },
      async init({ logger, config, httpRouter, httpAuth }) {
        const servicenowConfig: ServiceNowConfig | undefined =
          readServiceNowConfig(config);

        if (!servicenowConfig) {
          logger.error(
            'ServiceNow plugin configuration is missing. The plugin will not be initialized.',
          );
          return;
        }

        httpRouter.use(
          await createRouter({
            logger,
            servicenowConfig,
            httpAuth,
          }),
        );
      },
    });
  },
});
