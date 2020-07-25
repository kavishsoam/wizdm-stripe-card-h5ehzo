import { OnInit, OnChanges, SimpleChanges, OnDestroy, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Elements, Element, ElementType, ElementOptions, ChangeEventObject } from './stripe-definitions/element';
import { StripeError } from './stripe-definitions/error';
import { StripeConfig } from './stripe-factory';

/** StripeElement types */
export type StripeElementType = Exclude<ElementType, 'paymentRequestButton'>;

/** 
 * Abstract generic class turning a StripeElement into an Angular component with basic features
 * To be used as the base class for all the Stripe related specific components: StripeCard...
 */
export abstract class StripeElement<T extends StripeElementType> implements OnInit, OnChanges, OnDestroy {

  constructor(readonly elementType: T, private elements: Elements, private config: StripeConfig<T>,private ref: ElementRef<HTMLElement>) {}

  /**
   * Implement this getter to provide component specific options during element creation and update
   */
  protected abstract get options(): ElementOptions<T>;

  /** The stripe element */
  public element: Element<T>;
  
  /** The latest change value */
  public value: ChangeEventObject<T>;

  /** True whenever the element is fully loaded */
  public ready: boolean = false;
  
  /** True whenever the element is focused */
  public focused: boolean;

  /** True whenever the element is disabled */
  public disabled: boolean;

  /** True whenever the element is required */
  public required: boolean;

  /** True whenever the element is empty */
  public get empty(): boolean {
    return !this.value || this.value.empty;
  }

  /** True whenever the element is complete and valid */
  public get complete(): boolean {
    return !!this.value && this.value.complete;
  }

  /** The StripeError or null */
  public get error(): StripeError | null {
    return !!this.value && this.value.error || null;
  }

  ngOnInit() { 

    // Creates the requested Stripe element
    this.element = this.elements.create(this.elementType, { ...this.config.elementOptions, ...this.options });
    
    // Hooks on the element's events
    this.element.on('ready', (value) => { this.ready = true; this.readyChange.emit(value); });
    this.element.on('focus', (value) => { this.focused = true; this.focusChange.emit(value); });
    this.element.on('blur',  (value) => { this.focused = false; this.blurChange.emit(value); });
    this.element.on('change',(value: ChangeEventObject<T>) => this.valueChange.emit(this.value = value) );
    
    // Mounts the element on the DOM
    this.element.mount(this.ref.nativeElement); 
  }

  ngOnChanges(changes: SimpleChanges) { 
    // Updates the element on input changes
    this.update(this.options); 
  }

  ngOnDestroy() { 
    // Disposes of the element    
    this.element && this.element.destroy(); 
  }

  /** Updates the element */
  public update(options: ElementOptions<T>) { 

    if(!this.element) { return; }

    // Ensures to correctly reflect the disabled status
    if('disabled' in options) {
      this.disabled = options.disabled;
    }
    
    // Updates the element
    this.element.update(options); 
  }

  /** Focus the element */
  public focus() { this.element && this.element.focus(); }

  /** Blurs teh element */
  public blur() { this.element && this.element.blur(); }

  /** Clears teh element */
  public clear() { this.element && this.element.clear(); }

  /** Marks the eleemnt as required */
  @Input('required') set requiredSetter(value: boolean) { this.required = coerceBooleanProperty(value); }

  /** Emits when fully loaded */
  @Output('ready') readyChange = new EventEmitter();
  
  /** Emits when focused */
  @Output('focus') focusChange = new EventEmitter();
  
  /** Emits when blurred */
  @Output('blur') blurChange = new EventEmitter();
  
  /** Emits on status changes */
  @Output('change') valueChange = new EventEmitter<ChangeEventObject<T>>();
}