import { Global, Module } from '@nestjs/common';
import { HashidService } from './services/hashid.service.js';
import { HashidParamPipe } from './pipes/hashid-param.pipe.js';
import { HashidInterceptor } from './interceptors/hashid.interceptor.js';

@Global()
@Module({
  providers: [HashidService, HashidParamPipe, HashidInterceptor],
  exports: [HashidService, HashidParamPipe, HashidInterceptor],
})
export class CommonModule {}
