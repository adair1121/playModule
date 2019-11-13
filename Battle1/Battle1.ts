/**
 * 说明:
 * 游戏结束 会派送事件 gameend; 参数有 score 
 * 人物收到伤害 会派送 reduceHp;
 * 
 * 当前模块中 存在的命名空间 cq-GlobalData 存着该玩法中的一些数据 。可对外读取
 * initialize 初始化组件
 */
namespace bm{
	export class globalData {
		/**资源列表 */
		public static resource:ResourceVo;
		/**人物总血量 */
		public static readonly tolHp:number = 8;
		/**父容器 */
		public static parentLayer:any;
		/**人物分数 */
		public static score:number = 0;
	}
	export class ResourceVo{
		/**人物模型资源 */
		roleImg:string;
		/**怪物资源集合 */
		monsters:string[];
		/**子弹资源 */
		bullet:string;
		/**虚拟轮盘底部资源 */
		vj_bottom:string;
		/**虚拟轮盘按钮资源 */
		vj_cir:string;
		/**分数+1资源 */
		scoreImg:string;
		/**goldImg 金币图标 */
		goldImg:string;
		/**爆炸特效 --url全局路径 例如 Effectboom*/
		boomRes:string;
	}

//----怪物item---
class MonsterItem extends eui.Component{

	private _hp:number = 0;
	private _removed:boolean = false;
	private _chp:number = 0;
	private hpShape:eui.Rect;
	private _index:number = 0;
	public constructor() {
		super();
	}
	protected childrenCreated():void{
		let index:number = (Math.random()*bm.globalData.resource.monsters.length)>>0;
		let sourcestr:string = bm.globalData.resource.monsters[index];
		this._index = index;
		let img:eui.Image = new eui.Image(sourcestr);
		this.scaleX = this.scaleY = 0.8;
		this.addChild(img);
		this._hp = 300+index*100;
		this._chp = this._hp;
		this.x = StageUtils.inst().getWidth()+130;
		let h:number = StageUtils.inst().getHeight() - 140 - 100;
		this.y = 140 + (Math.random()*h)>>0;

		let zx:number = -140;
		let distance:number = this.x - zx ; 
		let speed:number = 100;
		let time:number = distance/speed*1000;

		this.hpShape = new eui.Rect();
		this.hpShape.fillColor = 0xff0000;
		this.hpShape.width = 60;
		this.hpShape.height = 5;
		this.addChild(this.hpShape);
		this.hpShape.y = -20;
		this.hpShape.x = (img.width - this.hpShape.width)>>1;
		let yy:number = this.y;
		if(index != 2){
			egret.Tween.get(this,{loop:true}).to({y:yy+((Math.random()*50)>>0)+50},2000).to({y:yy},2000)
		}

		egret.Tween.get(this).to({x:zx},time).call(()=>{
			egret.Tween.removeTweens(this);
			this.parent.removeChild(this);
			this._removed = true;
		})
	}
	public reduceHp():void{
		this._chp -= 100;
		let w:number = this._chp/this._hp*60;
		this.hpShape.width = w
		if(this._chp <= 0){
			this.hpShape.width = 0;
			this._chp = 0;
			let boomMc:MovieClip = new MovieClip();
			this.addChild(boomMc);
			boomMc.playFile(bm.globalData.resource.boomRes,1,null,true);
			this._removed = true;
			let self = this;
			egret.Tween.removeTweens(this);
			bm.globalData.score += (this._index+1);
			let timeout = setTimeout(function() {
				clearTimeout(timeout);
				if(self && self.parent){
					self.parent.removeChild(self);
				}
			}, 600);
		}
	}
	public get removed():boolean{
		return this._removed;
	}
}
//------金币形状----------
class ShapeGold extends eui.Component{

	private _shapeType:number;
	/**
	 * shape :  ShapeType_1 ShapeType_2...
	 */
	private shapCon:egret.DisplayObjectContainer;
	public constructor(shape:number) {
		super();
		this._shapeType = shape;
	}
	protected childrenCreated():void{
		this.shapCon = new egret.DisplayObjectContainer();
		this.addChild(this.shapCon);
		switch(this._shapeType){
			case 0:
				this.createArrow();
				break;
			case 1:
				this.createCircle();
				break;
			case 2:
				this.createCross();
				break;
			case 3:
				this.createHalfCircle();
				break;
			case 4:
				this.createLingxing();
				break;
			case 5:
				this.createRect();
				break;
			case 6:
				this.createTiXing();
				break;
			case 7:
				this.createTriangle();
				break;
		}
	}
	/**创建方阵 */
	private createRect(rotation?:number,_rows?:number,_cols?:number,offx:number= 0,offy:number = 0):void{
		let row:number = 5;
		let col:number = 5;
		if(_rows){row = _rows}
		if(_cols){col = _cols}
		for(let i:number = 0;i<row;i++){
			for(let j:number = 0;j<col;j++){
				let sp:eui.Image = this.createShape();
				this.shapCon.addChild(sp);
				sp.x = j*(sp.width + 10) + offx;
				sp.y = i*(sp.height + 10) + offy;
				if(rotation){
					sp.rotation = rotation
				}
			}
		}
	}
	/**创建圆形阵 */
	private createCircle():void{
		let radius:number = 75;
		let angles:number[] = [0,45,90,135,180,-45,-90,-135];
		for(let i:number = 0;i<3;i++){
			radius -= 25;
			for(let j:number = 0;j<angles.length;j++){
				let x:number = Math.cos(angles[j]*Math.PI/180)*radius;
				let y:number = Math.sin(angles[j]*Math.PI/180)*radius;
				let sp:eui.Image = this.createShape();
				this.shapCon.addChild(sp);
				sp.x = x;
				sp.y = y;
			}
		}
	}
	/**创建半月形阵 */
	private createHalfCircle():void{
		let radius:number = 130;
		let angles:number[] = [-90,-45,0,45,90];
		for(let i:number = 0;i<5;i++){
			radius -= 25;
			for(let j:number = 0;j<angles.length;j++){
				let x:number = Math.cos(angles[j]*Math.PI/180)*radius;
				let y:number = Math.sin(angles[j]*Math.PI/180)*radius;
				let sp:eui.Image = this.createShape();
				this.shapCon.addChild(sp);
				sp.x = x;
				sp.y = y;
			}
		}
	}
	/**创建菱形阵 */
	private createLingxing():void{
		this.createRect(-45);
		this.shapCon.anchorOffsetX = this.shapCon.width>>1;
		this.shapCon.anchorOffsetY = this.shapCon.height>>1;
		this.shapCon.rotation = 45;
	}
	/**
	 * 三角阵
	 */
	private createTriangle(firstnum = 7,offestX:number = 0,_offy:number = 0):void{
		let firstColNum:number = firstnum;
		let offestY:number = 0;
		for(let i:number = 0;i < (firstnum-1	);i++){
			firstColNum -= 1; //实际上第一列有6个
			offestY += 10;
			for(let j:number = 1;j<=firstColNum;j++){
				let sp:eui.Image = this.createShape();
				this.shapCon.addChild(sp);
				sp.y = j*(sp.height + 10) + offestY - _offy;
				sp.x = i*(sp.width + 10) + offestX;
			}
		}
	}
	/**梯形阵 */
	private createTiXing():void{
		let firstColNum:number = 8;
		let offestY:number = 0;
		for(let i:number = 0;i < 6;i++){
			firstColNum -= 1; //实际上第一列有6个
			if(firstColNum <= 2){
				break;
			}
			offestY += 10;
			for(let j:number = 1;j<=firstColNum;j++){
				let sp:eui.Image = this.createShape();
				this.shapCon.addChild(sp);
				sp.y = j*(sp.height + 10) + offestY;
				sp.x = i*(sp.width + 10);
			}
		}
	}
	/**创建箭头形状 */
	private createArrow():void{
		this.createRect(null,2,5);
		this.createTriangle(6,5*(15+10),70)
	}
	/**创建加号形状 */
	private createCross():void{
		this.createRect(null,2,3);
		this.createRect(null,2,3,100);
		this.createRect(null,3,2,60,-75);
		this.createRect(null,3,2,60,50);
	}

	//测试 。创建shape
	private createShape():eui.Image{
		let sp:eui.Image = new eui.Image();
		sp.width = sp.height = 15;
		sp.source = bm.globalData.resource.goldImg;
		return sp;
	}
}

//-------子弹item--------
class BulletItem extends eui.Component{
	private _x:number = 0;
	private _y:number = 0;
	private _hited:boolean = false;
	private _removed:boolean = false;
	public constructor(x,y) {
		super();
		this._x = x;
		this._y = y;
	}
	protected childrenCreated():void{
		let img:eui.Image = new eui.Image();
		this.addChild(img);
		img.source = bm.globalData.resource.bullet;
		this.x = this._x;
		this.y = this._y;
		let zx:number = StageUtils.inst().getWidth()+100;
		let distance:number = zx - this._x; 
		let speed:number = 300;
		let time:number = distance/speed*1000;
		egret.Tween.get(this,{loop:false,onChange:()=>{
			if(this._hited){
				//当前子弹撞击了;
				egret.Tween.removeTweens(this);
				if(this && this.parent){
					this.parent.removeChild(this);
				}
				this._removed = true;
			}
		},onChangeObj:this}).to({x:zx},time).call(()=>{
			egret.Tween.removeTweens(this);
			this.parent.removeChild(this);
			this._removed = true;
		},this)
	}
	public set hited(value){
		this._hited = value;
	}
	public get removed():boolean{
		return this._removed
	}
	public dispose():void{
		egret.Tween.removeTweens(this);
	}
}
export class BattleModel1 extends eui.Component{

	private singleFrame:number = 33.3;
	private roleMc:eui.Image;
	private tolHp:number = 8;
	private createbulltTime:number = 0;
	private createMonsterTime:number = 4000;
	private createGoldGroupTime:number = 10000;
	private bulletArr:BulletItem[];
	private monsterArr:MonsterItem[];
	private vj:VirtualJoystick;
	private _angle:number;
	private watcher:eui.Watcher;
	private watcher2:eui.Watcher;
	private bottomGroup:eui.Group;
	private wudiState:boolean = false;
	private shapeGolds:ShapeGold[];
	private GAMEEND:string = "gameend";
	private REDUCE_HP:string = "reduceHp";

	public initialize(resource:ResourceVo,_parentLayer:egret.DisplayObjectContainer):void{
		bm.globalData.resource = resource;
		bm.globalData.parentLayer = _parentLayer;
		this.open();
	}
	private open(...param):void{
		this.tolHp = bm.globalData.tolHp;
		this.bulletArr = [];
		this.monsterArr = [];
		this.shapeGolds = [];
		// egret.Tween.get(this).to({alpha:1},1200).call(()=>{
		// 	egret.Tween.removeTweens(this);
		// },this)
		this.roleMc = new eui.Image(bm.globalData.resource.roleImg)
		bm.globalData.parentLayer.addChildAt(this.roleMc,2);
		this.roleMc.y = (StageUtils.inst().getHeight() - 50)>>1;
		this.roleMc.x = 80;
		// this.scoreLab.text = "0";
		this.vj = new VirtualJoystick();
		bm.globalData.parentLayer.addChild(this.vj);
		this.vj.left = 0;
		this.vj.bottom = 0;

		egret.startTick(this.execAction,this)
		this.vj.start();
		this.vj.addEventListener(VJEvent.VJ_START,this.onVjStart, this);
		this.vj.addEventListener(VJEvent.VJ_MOVE, this.onVjChange, this);
		this.vj.addEventListener(VJEvent.VJ_END, this.onVjEnd, this);
		// this.watcher = eui.Binding.bindProperty(GameApp,["score"],this.scoreLab,"text");
		this.watcher2 = eui.Binding.bindHandler(this,["tolHp"],this.tolHpChange,this);
	}
	private tolHpChange(value:number):void{
		this.tolHp -= 1;
		if(this.tolHp <= 0){
			this.tolHp = 0
			this.onGoback();
		}else{
			MessageManager.inst().dispatch(this.REDUCE_HP)
		}
	}
	private onVjStart():void{
		this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
	}
	private onEnterFrame():void{
		if(this._angle){
			let offestX:number = Math.cos(this._angle)*12;
			let offestY:number = Math.sin(this._angle)*12;
			this.roleMc.x += offestX;
			this.roleMc.y += offestY;
			if(this.roleMc.x <= 50){
				this.roleMc.x = 50;
			}
			if(this.roleMc.y <= 50){
				this.roleMc.y = 50
			}
			if(this.roleMc.x >= StageUtils.inst().getWidth()-50){
				this.roleMc.x = StageUtils.inst().getWidth()-50;
			}
			if(this.roleMc.y >= StageUtils.inst().getHeight() - 50){
				this.roleMc.y = StageUtils.inst().getHeight() - 50;
			}
			// let point: egret.Point = qmr.SceneModel.prototype.mainScene.globalToLocal(evt.stageX, evt.stageY);
		}
	}
	private onVjChange(evt:VJEvent):void{
		this._angle = evt.data;
	}
	private onVjEnd():void{
		this._angle = null;
		this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
	}
	private execAction():boolean{
		this.createbulltTime += this.singleFrame;
		if(this.createbulltTime >= 1200){
			//生成子弹
			this.createbulltTime = 0;
			let bullet:BulletItem = new BulletItem(this.roleMc.x,this.roleMc.y+40);
			bm.globalData.parentLayer.addChild(bullet);
			this.bulletArr.push(bullet);
		}
		this.createMonsterTime += this.singleFrame;
		if(this.createMonsterTime >= 4000){
			this.createMonsterTime = 0;
			let num:number = (Math.random()*3)>>0;
			for(let i:number = 0;i<num;i++){
				let monster:MonsterItem = new MonsterItem();
				bm.globalData.parentLayer.addChildAt(monster,3);
				this.monsterArr.push(monster);
			}
		}
		this.createGoldGroupTime += this.singleFrame;
		if(this.createGoldGroupTime >= 10000){
			this.createGoldGroupTime = 0;
			let num:number = (Math.random()*8)>>0;
			let shapeGold:ShapeGold = new ShapeGold(num);
			bm.globalData.parentLayer.addChild(shapeGold);
			shapeGold.x = StageUtils.inst().getWidth()+100;
			let h:number = StageUtils.inst().getHeight() - 200 - 200;
			shapeGold.y  = 200 + (Math.random()*h)>>0;

			let zx:number = -200;
			let distance:number = shapeGold.x - zx ; 
			let speed:number = 100;
			let time:number = distance/speed*1000;
			this.shapeGolds.push(shapeGold);
			egret.Tween.get(shapeGold).to({x:zx},time).call(()=>{
				egret.Tween.removeTweens(shapeGold);
				shapeGold.parent.removeChild(shapeGold);
			},this)
		}
		for(let i:number = 0;i<this.bulletArr.length;i++){

			for(let j:number = 0;j<this.monsterArr.length;j++){
				if(this.bulletArr[i] && !this.bulletArr[i].removed){
					//子弹还未处于移除状态
					let distance:number = egret.Point.distance(new egret.Point(this.bulletArr[i].x,this.bulletArr[i].y),
					new egret.Point(this.monsterArr[j].x,this.monsterArr[j].y))
					if(this.monsterArr[j] && !this.monsterArr[j].removed){
						//当前怪物也是存活状态;
						if(distance <= 50){
							//碰撞了;
							this.bulletArr[i].hited = true;
							this.monsterArr[j].reduceHp();
						}
					}
				}
			}
		}
		for(let j:number = 0;j<this.monsterArr.length;j++){
			if(this.monsterArr[j] && !this.monsterArr[j].removed){
				//子弹还未处于移除状态
				if(!this.wudiState){
					if((this.roleMc.y > this.monsterArr[j].y && this.roleMc.y < this.monsterArr[j].y + this.monsterArr[j].height) || 
					(this.roleMc.y+this.roleMc.height > this.monsterArr[j].y && this.roleMc.y+this.roleMc.height < this.monsterArr[j].y + this.monsterArr[j].height)){
						if((this.roleMc.x + this.roleMc.width > this.monsterArr[j].x && this.roleMc.x+this.roleMc.width < this.monsterArr[j].x + this.monsterArr[j].width) ||
						(this.roleMc.x > this.monsterArr[j].x && this.roleMc.x < this.monsterArr[j].x + this.monsterArr[j].width)){
							this.tolHp -= 1;
							this.wudiState = true;
							egret.Tween.get(this.roleMc,{loop:true}).to({alpha:0},600).to({alpha:1});
							let self = this;
							// if(GameApp.effectPlay){
							// 	// SoundManager.inst().stopEffect();
							// 	SoundManager.inst().playEffect("resource/res/sound/udar.mp3");
							// }
							let timeout = setTimeout(function() {
								self.roleMc.alpha = 1;
								egret.Tween.removeTweens(self.roleMc);
								clearTimeout(timeout);
								self.wudiState = false;
							}, 3000);
						}
					}
				}
			}
		}
		
		for(let key in this.shapeGolds){
			let shapeItem:ShapeGold = this.shapeGolds[key];
			let firstChild:any = shapeItem.getChildAt(0)
			for(let i:number = 0;i<firstChild.numChildren;i++){
				let childP = firstChild.getChildAt(i);
				let stagey:egret.Point = childP.parent.localToGlobal(childP.x,childP.y);
				let localxy:egret.Point = this.globalToLocal(stagey.x,stagey.y);
				if((localxy.x > this.roleMc.x && localxy.x < this.roleMc.x + this.roleMc.width) && 
				(localxy.y > this.roleMc.y && localxy.y < this.roleMc.y + this.roleMc.height)){
					if(!childP.visible){
						continue;
					}
					childP.visible = false;
					// GameApp.score += 1;
					bm.globalData.score += 1;
					let scoreImg:eui.Image = new eui.Image(bm.globalData.resource.scoreImg);
					bm.globalData.parentLayer.addChild(scoreImg);
					scoreImg.x = localxy.x;
					scoreImg.y = localxy.y;
					egret.Tween.get(scoreImg).to({y:scoreImg.y - 200,alpha:0},600,egret.Ease.circIn).call(()=>{
						egret.Tween.removeTweens(scoreImg);
						scoreImg.parent.removeChild(scoreImg);
					},this)
					// if(GameApp.effectPlay){
					// 	SoundManager.inst().playEffect("resource/res/sound/star.mp3");
					// }
				}	
				// if((this.roleMc.y > localxy.y && this.roleMc.y < localxy.y + 15) || 
				// 	(this.roleMc.y+this.roleMc.height > localxy.y && this.roleMc.y+this.roleMc.height < localxy.y + 15)){
				// 		if((this.roleMc.x + this.roleMc.width > localxy.x && this.roleMc.x+this.roleMc.width < localxy.x + 15) ||
				// 		(this.roleMc.x > localxy.x && this.roleMc.x < localxy.x + 15)){
							
				// 		}
				// }
			}
		}
		return false;
	}
	private onGoback():void{
		this.clear();
		// egret.Tween.get(this).to({alpha:0},1200).call(()=>{
		// 	ViewManager.inst().close(GameMainView);
		// },this)
		// this.parent.removeChild(this);
		MessageManager.inst().dispatch(this.GAMEEND,{score:bm.globalData.score});
		// ViewManager.inst().open(StartGameView);
	}
	private clear():void{
		// this.tolHp = 8;
		egret.stopTick(this.execAction,this);
		// GameApp.score = 0;
		this.createbulltTime = 0;
		this.createMonsterTime = 4000;
		this.wudiState = false;
		for(let i:number = 0;i<this.bulletArr.length;i++){
			if(this.bulletArr[i] && this.bulletArr[i].parent){
				this.bulletArr[i].dispose();
				this.bulletArr[i].parent.removeChild(this.bulletArr[i]);
			}
		}
		for(let j:number = 0;j<this.monsterArr.length;j++){
			if(this.monsterArr[j] && this.monsterArr[j].parent){
				egret.Tween.removeTweens(this.monsterArr[j]);
				this.monsterArr[j].parent.removeChild(this.monsterArr[j]);
			}
		}
		for(let j:number = 0;j<this.shapeGolds.length;j++){
			if(this.shapeGolds[j] && this.shapeGolds[j].parent){
				egret.Tween.removeTweens(this.shapeGolds[j]);
				this.shapeGolds[j].parent.removeChild(this.shapeGolds[j]);
			}
		}
		this.monsterArr= [];
		this.bulletArr = [];
		this.shapeGolds = [];
		if(this.watcher){this.watcher.unwatch()}
	}
	
}
}




