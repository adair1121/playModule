/**
 * 猜灯谜模块
 * 
 * 首先初始化模块
 * dm.initialize(resource,cfg)
 * 
 * 打开模块
 * dm.openModule()
 * 关闭模块
 * dm.closeModule()
 * 
 * 
 * 提交后事件的派发
 * MessageManager.inst().dispatch("SUBMIT",{state:"result",win:1})
*  MessageManager.inst().dispatch("SUBMIT",{state:"result",win:0,desc:"您给出的答案不正确,是否重新开始"})
 */

namespace dm{
	export class ResourceVo{
		/**背景资源 */
		public bgSource:string;
		/** 灯笼图标*/
		public denglongIcon:string;
		/**按键块儿 */
		public blockSource:string;
	}
	export class globalData{
		public static resource:ResourceVo;
		public static questionCfgs:{display:string,result:string,msg:string}[]
	}
	export function initialize(resource:dm.ResourceVo,config:{display:string,result:string,msg:string}[]):void{
		dm.globalData.resource = resource;
		dm.globalData.questionCfgs = config;
		ViewManager.inst().reg(PlayDengMiPop,LayerManager.UI_Pop);
		
	}
	/**打开模块 */
	export function openModule(){
		ViewManager.inst().open(PlayDengMiPop);
	}
	/**关闭模块 */
	export function closeModule(){
		ViewManager.inst().close(PlayDengMiPop)
	}

class PlayDengMiPop extends BaseEuiView{

	private sureBtn:eui.Group;
	private guessLab:eui.Label;
	private guessGroup:eui.Group;
	private typeLab:eui.Label;
	private curQuestionCfg:any;
	private wordGroup:eui.Group;

	public constructor() {
		super();
		this.skinName = `<?xml version="1.0" encoding="utf-8"?>
<e:Skin class="PlayDengMiPopSkin" width="512" height="1024" xmlns:e="http://ns.egret.com/eui" xmlns:w="http://ns.egret.com/wing">
	<e:Rect left="0" top="0" right="0" bottom="0" alpha="0.3"/>
	<e:Image source="${dm.globalData.resource.bgSource}" left="0" top="0" right="0" bottom="0"/>
	<e:Label text="猜灯谜" horizontalCenter="8" top="29" textColor="0xf27a24"/>
	<e:Group id="wordGroup" horizontalCenter="0" top="533" touchChildren="true" touchEnabled="false" touchThrough="true">
		<e:Group id="word1" x="0" y="0" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0"/>
			<e:Label text="我" x="0" y="2" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="word2" x="94" y="0" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0"/>
			<e:Label text="我" x="2" y="2" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="word3" x="190" y="0" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0"/>
			<e:Label text="我" x="2" y="0" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="word4" x="286" y="0" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0"/>
			<e:Label text="我" x="2" y="2" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="word5" x="0" y="96" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0"/>
			<e:Label text="我" x="4" y="0" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="word6" x="94" y="96" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0"/>
			<e:Label text="我" x="0" y="2" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="word7" x="190" y="96" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0"/>
			<e:Label text="我" x="2" y="2" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="word8" x="286" y="96" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0"/>
			<e:Label text="我" x="0" y="2" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="word9" x="0" y="194" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="2" y="0"/>
			<e:Label text="我" x="0" y="2" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="word10" x="96" y="194" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0"/>
			<e:Label text="我" x="0" y="2" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="76" name="lab"/>
		</e:Group>
		<e:Group id="sureBtn" x="190" y="194" touchChildren="false" touchEnabled="true" touchThrough="false">
			<e:Image source="${dm.globalData.resource.blockSource}" x="0" y="0" anchorOffsetX="0" width="176"/>
			<e:Label text="确定" x="0" y="2" anchorOffsetY="0" height="78" textAlign="center" verticalAlign="middle" anchorOffsetX="0" width="176"/>
		</e:Group>
	</e:Group>
	<e:Group horizontalCenter="-1" top="487" touchChildren="true" touchEnabled="false" touchThrough="true">
		<e:Rect width="230" height="37.33" x="0" y="0" strokeColor="0xffffff" strokeWeight="2" anchorOffsetX="0" anchorOffsetY="0" fillAlpha="0"/>
		<e:Group id="guessGroup" touchChildren="true" touchEnabled="false" touchThrough="true" height="38" horizontalCenter="0" verticalCenter="0"/>
	</e:Group>
	<e:Group horizontalCenter="0" top="92">
		<e:Image source="${dm.globalData.resource.denglongIcon}" anchorOffsetX="0" width="354.55" anchorOffsetY="0" height="390" x="0" y="0"/>
		<e:Label id="guessLab" text="Label" x="56" y="93.33" anchorOffsetX="0" width="243.7" anchorOffsetY="0" height="58.79" textAlign="center" verticalAlign="middle" size="20"/>
		<e:Label id="typeLab" text="打一成语" x="229.78" y="183.03" anchorOffsetX="0" width="118.43" anchorOffsetY="0" height="23.94" size="20"/>
	</e:Group>
</e:Skin>`
	}
	protected childrenCreated():void{
		
	}
	public open(...param):void{
		this.sureBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onSure,this);
		this.showQuestion();
		this.wordGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
		this.guessGroup.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onGuessBackTouch,this);
		MessageManager.inst().addListener("RETURN",this.onReturn,this)
		MessageManager.inst().addListener("DL_NEXT",this.onNext,this);
		MessageManager.inst().addListener("DL_RESET",this.onReset,this);
	}	
	private onNext():void{
		this.showQuestion();
	}
	private onReset():void{
		this.showQuestion(this.curQuestionCfg.result)
	}
	private answer:string = "";
	private onTouchTap(evt:egret.TouchEvent):void{
		if(evt.target instanceof eui.Group){
			let label:eui.Label = evt.target.getChildByName("lab") as eui.Label;
			if(!!label && label.text){
				this.answer += label.text;
				if(this.guessGroup.numChildren >= 4){
					UserTips.inst().showTips("已达上限");
					return;
				}
				let group:eui.Group = this.createBlock(label.text);
				group.left = this.guessGroup.numChildren*30+ (this.guessGroup.numChildren)*10 - 10;
				group.y = 5;
				this.guessGroup.width = this.guessGroup.numChildren*(30) + (this.guessGroup.numChildren)*10
				this.guessGroup.addChild(group);
			}
		}
	}
	private onGuessBackTouch(evt:egret.TouchEvent):void{
		if(evt.target instanceof eui.Group){
			let label:eui.Label = evt.target.getChildByName("lab") as eui.Label;
			if(!!label){
				this.guessGroup.removeChild(evt.target)
				for(let i:number = 0;i<this.guessGroup.numChildren;i++){
					(<eui.Group>this.guessGroup.getChildAt(i)).left = i*30+ (i)*10 - 10;
					this.guessGroup.getChildAt(i).y = 5;
				}
				this.guessGroup.width -= 40;
				let index:number = this.answer.indexOf(label.text);
				if(index != -1){
					this.answer.slice(index,1);
				}
			}
		}
	}
	private createBlock(cnt:string):eui.Group{
		let group:eui.Group = new eui.Group();
		group.width = group.height = 30;
		group.touchEnabled = true;
		group.touchChildren = false;
		group.touchThrough = false;
		let block:eui.Image = new eui.Image("img_dengmi_cell_bg_png");
		group.addChild(block);
		block.right = block.top = block.left = block.bottom = 0;

		let txt:eui.Label = new eui.Label();
		group.addChild(txt);
		txt.size = 20;
		txt.horizontalCenter = 0;
		txt.verticalCenter = 0;
		txt.name = "lab";
		txt.text = cnt;
		return group;		
	}
	private showQuestion(word?:string):void{
		this.guessGroup.removeChildren();
		// for(let i:number = 0;i<this.guessGroup.numChildren;i++){
		// 	let item = this.guessGroup.getChildAt(i);
		// 	if(item && item.parent){
		// 		item.parent.removeChild(item);
		// 	}
		// }
		let wordstr:string = "";
		for(let i:number = 0;i<=5;i++){
			wordstr += this.randomfont();
			
		}
		let cfgs:any[] = dm.globalData.questionCfgs;
		let index:number = (Math.random()*cfgs.length)>>0;
		let cfg:any = cfgs[index];

		if(!word){
			this.guessLab.text = cfg.display
			this.typeLab.text = cfg.msg;
			this.curQuestionCfg = cfg;
			wordstr += cfg.result;
		}else{
			wordstr += word;
		}
		let wordArr:string[] = wordstr.split("");
		for(let i:number = 0;i<10;i++){
			let label:eui.Label = this["word"+(i+1)].getChildByName("lab");
			if(label){
				let index:number = (Math.random()*wordArr.length)>>0;
				let font:string = wordArr[index];
				wordArr.splice(index,1);
				label.text = font;
			}
		}
	}
	private onSure():void{
		if(!this.guessGroup.numChildren){
			UserTips.inst().showTips("请输入有效答案")
			return;
		}
		if(this.answer && this.answer == this.curQuestionCfg.result){
			//回答正确
			UserTips.inst().showTips("回答正确")
			MessageManager.inst().dispatch("SUBMIT",{state:"result",win:1})
			// ViewManager.inst().open(OverView,[{state:"result",win:1}])
		}else{
			UserTips.inst().showTips("回答错误")
			MessageManager.inst().dispatch("SUBMIT",{state:"result",win:0,desc:"您给出的答案不正确,是否重新开始"})
			//回答错误
			// ViewManager.inst().open(OverView,[{state:"result",win:0,desc:"您给出的答案不正确,是否重新开始"}])
		}
	}
	private randomfont():string{
		var _len = 1;
		var i=0;
		var _str = "";
		var _base = 20000;
		var _range = 700;
		while(i < _len){
			i++;
			var _lower = (Math.random() * _range)>>0;
			_str += String.fromCharCode(_base + _lower);
		}
		return _str;
	}
	private onReturn():void{
		ViewManager.inst().close(PlayDengMiPop);
	}
	public close():void{
		this.wordGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onTouchTap,this);
		this.guessGroup.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onGuessBackTouch,this);
		MessageManager.inst().removeListener("RETURN",this.onReturn,this)
		MessageManager.inst().removeListener("DL_NEXT",this.onNext,this);
		MessageManager.inst().removeListener("DL_RESET",this.onReset,this);
	}
}


}
