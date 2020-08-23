import { Component, OnInit, forwardRef, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-custom-checkbox',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomCheckboxComponent),
    multi: true
  }],
  templateUrl: './custom-checkbox.component.html',
  styleUrls: ['./custom-checkbox.component.css']
})
export class CustomCheckboxComponent implements OnInit, ControlValueAccessor {
  onChange: (checked: boolean) => void;
  onTouched: () => void;
  @ViewChild('checkboxElement', {static: true}) checkboxElement: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {
  }

  writeValue(value: boolean): void {
    this.renderer.setProperty(this.checkboxElement.nativeElement, 'checked', value);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    return;
  }

  toggleCheckbox(event: any): void {
    this.onTouched();
    this.onChange(event.target.checked);
  }

}
