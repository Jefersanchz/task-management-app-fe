import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnModalComponent } from './column-modal.component';

describe('ColumnModalComponent', () => {
  let component: ColumnModalComponent;
  let fixture: ComponentFixture<ColumnModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
