// convenient wrapper for slider
class customSlider{
	constructor(text, x, y, defaultVal, step, min, max, size){
		this.text = text;
		this.x = x;
		this.y = y;
		this.slider = createSlider(min, max, defaultVal, step).position(x, y).size(size);
	}
	
	getVal(){
		return this.slider.value();
	}
	
	show(){
		if(showSliders){
			this.slider.show();
			fill(255);
			text(this.text + " = " + this.getVal(), this.x + this.slider.width + 5, this.y);
		} else {
			this.slider.hide();
		}
		
	}
}