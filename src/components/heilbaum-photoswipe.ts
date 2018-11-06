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

    private items: Array<PhotoswipeItem> = [];
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
