import { TestBed } from '@angular/core/testing';
import { SharedModule } from './shared-module';
import { TruncatePipe } from './truncate-pipe';

describe('SharedModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SharedModule] });
  });

  it('should compile the module', () => {
    expect(SharedModule).toBeTruthy();
  });

  it('should provide a working TruncatePipe', () => {
    const pipe = new TruncatePipe();
    expect(pipe.transform('short text', 20)).toBe('short text');
    expect(pipe.transform('a'.repeat(100), 10)).toBe('a'.repeat(10) + '…');
    expect(pipe.transform(null)).toBe('');
  });
});
