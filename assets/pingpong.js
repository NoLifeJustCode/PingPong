var canvas=document.getElementById('Pong')
class vec{
    constructor(x=0,y=0){
        this.x=x;
        this.y=y;
    }
}
class Rect{
    constructor(x,y,height,width,speed){
        this.size=new vec(width,height)
        this.pos=new vec(x,y)
        this.speed=speed
    }
}
class Ball {
    constructor(x,y,radius,speed){
        this.pos=new vec(x,y)
        this.speed=speed
        this.xVel=this.yVel=speed
        this.yVel+=1
        this.radius=radius
    }
    getBottom=()=>{
        return this.pos.y+this.radius;
    }
    getTop=()=>{
        return this.pos.y-this.radius
    }
    getLeft=()=>{
        return this.pos.x-this.radius
    }
    getRight=()=>{
        return this.pos.x+this.radius
    }
    incVel=()=>{
        this.pos.x+=this.xVel
        this.pos.y+=this.yVel
    }
}

class Pong{

    constructor(canvas,fps){
        this.canvas=canvas
        this.fps=fps
        this.interval=1000/this.fps
        this.context=this.canvas.getContext('2d')
        this.rect=new Rect(0,0,this.canvas.height,this.canvas.width)
        this.Ball=new Ball(this.rect.size.x/2,this.rect.size.y/2,10,(200/this.fps));
        this.score=0;
        this.points=.1;
        this.milestone=500;
        this.multiplier=2;
        this.player=new Rect(this.rect.size.x/2-50,this.rect.size.x-20,20,100,10)
        this.render()
    }
    check=(player,ball)=>{
        
        if(ball.pos.x>=player.pos.x&&ball.pos.x<=player.pos.x+player.size.x){
            this.score+=this.points
            if(this.score>=this.milestone){
                this.points*=this.multiplier
                this.milestone*=this.multiplier
            }    
            if(ball.getBottom()+ball.radius>=player.pos.y)
                    return true;
                return false;
                
                
        }
        else if(ball.pos.y+ball.radius>this.rect.size.y)
            {
                this.endGame()
                document.getElementById('stop').dispatchEvent(new Event('click'))
                return false;
            }
    }
    startGame=()=>{
        this.ballInterval=setInterval(this.update,this.interval)
    }
    endGame=()=>{
            clearInterval(this.ballInterval)
            alert('Your Score is '+parseInt(this.score))
            this.init()
    }
    init=()=>{
            this.rect=new Rect(0,0,this.canvas.height,this.canvas.width)
            console.log(200/this.fps)
            this.Ball=new Ball(this.rect.size.x/2,this.rect.size.y/2,10,(200/this.fps));
            this.player=new Rect(this.rect.size.x/2-50,this.rect.size.x-20,20,100,10)
            this.render()
    }
    fillRect=(rect,color="black")=>{
        this.context.fillStyle=color
        this.context.fillRect(rect.pos.x,rect.pos.y,rect.size.x,rect.size.y)
    }
    fillCircle=(Ball,color="red")=>{
        this.context.fillStyle="red"
        this.context.beginPath()
        this.context.arc(Ball.pos.x,Ball.pos.y,Ball.radius,0,Math.PI*2,false)
        this.context.closePath()
        this.context.fill()
    }
    fillText=(text)=>{

            text+=" "+parseInt(this.score);
            console.log(text)
            var textWidth=100;
            var gradient = this.context.createLinearGradient(0, this.rect.size.x-textWidth,this.rect.size.x-textWidth ,textWidth);
            gradient.addColorStop("0"," magenta");
            gradient.addColorStop("0.5", "blue");
            gradient.addColorStop("1.0", "red");
            this.context.font="15px verdana"
            this.context.fillStyle = gradient;
            this.context.fillText(text,  this.rect.size.x-textWidth,30,textWidth);
    }
    render=()=>{
        console.log('rendering')
        
        this.fillRect(this.rect)
        this.fillRect(this.player,"white")
        this.fillCircle(this.Ball,"white")
        this.fillText("Score : ")
    }
    update=()=>{
            this.Ball.incVel();
            if(this.Ball.getLeft()<=0||this.Ball.getRight()>=this.rect.size.x)
                {
                    this.Ball.xVel=-this.Ball.xVel;
                    this.Ball.incVel()
                }
            if(this.Ball.getTop()<=0||this.check(this.player,this.Ball)){
                this.Ball.yVel=-this.Ball.yVel
                this.Ball.incVel()
            }
            
            this.render()
            

    }
    updatePlayerPos=(val)=>{
        console.log('updating')
        if(this.player.pos.x+val+this.player.size.x>this.rect.size.x||this.player.pos.x+val<0)
            return ;
        this.player.pos.x+=val;
        
    }
}
var pong=new Pong(canvas,100)
window.onload=function(){
    var can=document.getElementById('Pong')
    var lastDownTarget=null;
    var start=document.getElementById('start')
    var stop=document.getElementById('stop')
    start.addEventListener('click',function(event){
        lastDownTarget=can
        stop.disabled=false;
        start.disabled=true;
        pong.startGame()
    })
    stop.addEventListener('click',function(event){
        lastDownTarget=null
        stop.disabled=true;
        start.disabled=false;
        pong.endGame()
    })
    document.addEventListener('keydown',function(event){
        console.log('key')
        if(lastDownTarget==can)
            {
                if(event.keyCode==39||event.keyCode==37)
                    pong.updatePlayerPos(event.keyCode==39?pong.player.speed:-pong.player.speed);

            }
    })
}