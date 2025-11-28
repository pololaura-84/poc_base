import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BaseService } from './base.service';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

describe('BaseService', () => {
  let service: BaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BaseService, ApiService]
    });
    service = TestBed.inject(BaseService);
  });

  it('debe devolver datos mock cuando enableAuth=false', (done) => {
    expect(environment.enableAuth).toBeFalse();
    service.listBases().subscribe((bases) => {
      expect(bases.length).toBeGreaterThan(0);
      done();
    });
  });
});
