import {
    Component, OnInit, AfterViewInit, ElementRef, Renderer, ViewEncapsulation,
    ChangeDetectionStrategy
} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";

import { PhotoswipeItem } from "../photoswipe/PhotoswipeItem";
import { PhotoswipeDefaultSkin, PhotoswipeStyles } from "./styles";
import { PhotoswipeTemplate } from "./template";

declare const PhotoSwipe: any;
declare const PhotoSwipeUI_Default: any;

@Component({
    selector: 'heilbaum-photoswipe',
    styles: [PhotoswipeStyles, PhotoswipeDefaultSkin],
    template: PhotoswipeTemplate,
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None 
})
export class HeilbaumPhotoswipeComponent implements OnInit, AfterViewInit {

    private id: number;
    private heilBaumPhotoSwipeId: string;

    public showThumbs: number = 0;
    public items: Array<PhotoswipeItem>; //  = [];
    public prova: string;
    private options: Object = {};
	public afterChangeCallback: any;

    public gallery: any = null;

    /**
     * Constructor of class
     *
     * @param elementRef
     * @param navParams
     * @param renderer
     * @param viewCtrl
     */
    constructor(private elementRef: ElementRef, private navParams: NavParams, private renderer: Renderer, private viewCtrl: ViewController) {

	this.prova = 'assets/images/1.jpg';

        this.items = this.navParams.get('items');
	console.log('ho caricato gli items da navParams '+JSON.stringify(this.items));
	let test = this.items[0];
	let srcTest= test.src;

	console.log('test = '+srcTest);

        this.id = ++heilBaumPhotoSwipeId;
        this.heilBaumPhotoSwipeId = 'heilbaum-photoswiper-' + this.id;

        this.renderer.setElementClass(this.elementRef.nativeElement, this.heilBaumPhotoSwipeId, true);
		
		this.afterChangeCallback = this.navParams.get('afterChangeCallback');
		
    }

    /**
     * Angular 2 Lifecycle Hook
     */
    ngOnInit() {
        this.items = this.navParams.get('items');
        this.options = this.navParams.get('options') ? this.navParams.get('options') : {};
		
    }

   toggleThumbs() {
	
	if (this.showThumbs==1) this.showThumbs=0;
	else this.showThumbs=1;
  
   }

   showSlide(nrSlide) {
	
	let idxItem = this.items.indexOf(nrSlide);
	console.log('trying to go to slide nr. '+idxItem);
	this.gallery.goTo(idxItem);

	}

    /**
     * Angular 2 Lifecycle Hook
     */
    ngAfterViewInit() {
        const pswpElement: Element = this.elementRef.nativeElement.firstElementChild;

        this.gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, this.items, this.options);
        this.gallery.init();

        this.gallery.listen('destroy', () => {
            // This is required to remove component from DOM
            this.viewCtrl.dismiss();
        });
				
		var aftrChangeCallback = this.afterChangeCallback;
		
		this.gallery.listen('afterChange', function() { 
 
			if (aftrChangeCallback!=null)	{
				aftrChangeCallback.execute(this.getCurrentIndex());
			}

		});
		
    }

}

let heilBaumPhotoSwipeId = -1;
