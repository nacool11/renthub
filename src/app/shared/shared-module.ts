import { NgModule } from '@angular/core';
import { TruncatePipe } from './truncate-pipe';

@NgModule({
  imports: [TruncatePipe],
  exports: [TruncatePipe],
})
export class SharedModule {}
