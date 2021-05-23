const road = document.querySelector('.road');
const popup = document.querySelector('.popup')

let popUpanimation = {
    scaleAnimation: function(state){
        if(state){
            popup.style.transform = 'scale(0)';
        }else{
            popup.style.transform = 'scale(1)';

            while(road.hasChildNodes()){
                road.removeChild(road.firstChild);
            }

            console.log(road);

            popup.addEventListener('click', initiateAnimation);
        }
    },
}


const player = {
    speed: 5,
    state: true
}

const keys = {
    ArrowUp : false,
    ArrowDown : false,
    ArrowLeft : false,
    ArrowRight : false
}

spriteDistance = [150, 300, 150, 300, 150];

let roadAnimation = {
    createLines: function(){
        for(var i=0; i<6; i++){
            let line = document.createElement('div');
            line.setAttribute('class', 'line')
            line.y = -(i*150);
            line.style.top = line.y + "px";
            road.appendChild(line);
        }
    },   

    createEnemy: function(){
        eImgArray = ['bike.png', 'car-g.png', 'car-r.png','car-y.png', 'enemy1.png'];
        
        carArray = [];

        eImgArray.forEach(()=>{
            carArray.push(eImgArray[Math.floor(Math.random()*5)]);
        })

        
        for(var i=0; i<5; i++){
            let enemy = document.createElement('div');
            let enemyCar = document.createElement('img')
            // enemyCar.setAttribute('src', 'enemy1.png')
            enemyCar.setAttribute('src', `${carArray[i]}`)

            enemy.setAttribute('class', 'enemy');

            // enemy.y = -(i*150);

            enemy.y = -((i) * spriteDistance[Math.floor(Math.random()*5)]) - 150;

            enemy.z = enemy.y;

            enemy.style.top = enemy.y + "px";

            enemy.style.left = Math.floor(Math.random()*350) + "px";

            enemy.appendChild(enemyCar);
            road.appendChild(enemy);
        }
    },

    createSoloEnemy: function(dist){
        eImgArray = ['bike.png', 'car-g.png', 'car-r.png','car-y.png', 'enemy1.png'];
        
        carArray = [];

        eImgArray.forEach(()=>{
            carArray.push(eImgArray[Math.floor(Math.random()*5)]);
        })

        let enemy = document.createElement('div');
        let enemyCar = document.createElement('img')

        enemyCar.setAttribute('src', `${carArray[Math.floor(Math.random()*5)]}`)

        
        enemy.y = (-1*150);
        // enemy.y = dist;
        enemy.z = enemy.y;

        
        
        enemy.style.top = enemy.y + "px";
        
        enemy.style.left = Math.floor(Math.random()*350) + "px";

        console.log(enemy.style.left);
        
        enemy.appendChild(enemyCar);
        road.appendChild(enemy);

        enemy.setAttribute('class', 'enemy');
        startGame.enemyBoundaryCheck(enemy);
    },

    createPLayer: function(){
        let mainPlayer = document.createElement('div');
        let playerCar = document.createElement('img')
        playerCar.setAttribute('src', 'player1.png')
        mainPlayer.setAttribute('class', 'player');

        mainPlayer.appendChild(playerCar);
        road.appendChild(mainPlayer);

        player.x = mainPlayer.offsetLeft;
        player.y = mainPlayer.offsetTop;

    },

    keyDown: function(){
        document.addEventListener('keydown', (e)=>{
            e.preventDefault();
            keys[e.key] = true;
        })
    },

    keyUp: function(){
        document.addEventListener('keyup', (e)=>{
            e.preventDefault();
            keys[e.key] = false;
        })
    },
    
}

const startGame = {
    startRoadAnimation: function(){
        let lines = document.querySelectorAll('.line');

        lines.forEach((eachOne, index) =>{
            eachOne.y += player.speed;

            if(eachOne.y >= 800){
                eachOne.y -= 900;

            }

            eachOne.style.top = eachOne.y + "px";
        })
    },

    enemyAppearance: function(){

        let enemies = document.querySelectorAll('.enemy');

        enemies.forEach(eachOne =>{
            // eachOne.z = eachOne.y;
            eachOne.y += player.speed + -1;

            if(eachOne.y >= 800){

                eachOne.remove();
                roadAnimation.createSoloEnemy(eachOne.z);

            }

            eachOne.style.top = eachOne.y + "px";
        })

        return enemies;

    },

    playerMovement: function(){

        const mainPlayer = document.querySelector('.player')



        if(keys.ArrowUp && player.y > 100){
            player.y -= player.speed;
        }
        if(keys.ArrowDown && player.y < 650){
            player.y += player.speed;
        }
        if(keys.ArrowLeft && player.x > 0){
            player.x -= player.speed;
        }
        if(keys.ArrowRight && player.x < 360){
            player.x += player.speed;
        }

        mainPlayer.style.top = player.y + "px";
        mainPlayer.style.left = player.x + "px";


        return mainPlayer;

    },

    playerCollision: function(pCar,enemy){
        playerCarRect = pCar.getBoundingClientRect();

        let state = true;

        enemy.forEach(eCar=>{
            enemyCarRect = eCar.getBoundingClientRect();

            if(!((playerCarRect.bottom < enemyCarRect.top) || (playerCarRect.top > enemyCarRect.bottom) || (playerCarRect.right < enemyCarRect.left) || (playerCarRect.left > enemyCarRect.right))){
                state = false
            }
        })

        return state;
    },
    enemyBoundaryCheck: function(item){
        let enemies = document.querySelectorAll('.enemy');

        let selectedItem = item.getBoundingClientRect();

        console.log(selectedItem);

        enemies.forEach(eachOne =>{
            let checkingItem = eachOne.getBoundingClientRect();

            // console.log(checkingItem);
            if(eachOne != item){
                if(!((selectedItem.left > (checkingItem.right && checkingItem.left)) || (selectedItem.right < (checkingItem.right && checkingItem.left)))){
                    console.log('collision');
                }else{
                    console.log('nolap');
                }
            }
        })
        
        
    }
}

function start(){


    startGame.startRoadAnimation();
    // startGame.enemyBoundaryCheck();
    const enemy =  startGame.enemyAppearance();
    const mainPlayer = startGame.playerMovement();



    player.state =  startGame.playerCollision(mainPlayer, enemy);

    popUpanimation.scaleAnimation(player.state)

    if(player.state){
        window.requestAnimationFrame(start);
    }
}

function initiateAnimation(){
    roadAnimation.createLines();
    roadAnimation.createEnemy();
    roadAnimation.createPLayer();
    roadAnimation.keyDown();
    roadAnimation.keyUp();
    window.requestAnimationFrame(start);

}
initiateAnimation()



