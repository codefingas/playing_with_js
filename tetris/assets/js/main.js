const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

//===function that makes the game smart enough to notice that we didnt fill a row
function arenaSweep() {
	let rowCount = 1;
	outer : for (let y = arena.length - 1; y > 0; --y){
		for (let x = 0; x < arena[y].length; ++x) {
			if (arena[y][x] === 0) {
				continue outer;
			}
		}

		const row = arena.splice(y, 1)[0].fill(0);
		arena.unshift(row);
		++y;

		player.score += rowCount * 10;
		rowCount *= 2;
	}

}





//===function for detecting collision it takes the players matrix and pos====
function collide(arena, player) {
	const [m, o] = [player.matrix, player.pos];
	for (let y = 0; y < m.length; ++y) {
		for (let x = 0; x < m[y].length; ++x) {
			if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0){
				return true;
			}
		}
	}
	return false;
}




//-===function for creating matrix it takes a width and height as parameters===
function createMatrix(w, h){
	const matrix = [];
	while(h--) {
		matrix.push(new Array(w).fill(0));
	}
	return matrix;
}

  //===function for creating more pieces
  function createPiece(type){
  	//==the different numbers that are here indicates different colors that the numbers would be mapped to
  		//==conditiion that creates the piece "T";
  		if (type === "T") {
  			return [
				[0, 0, 0],
				[1, 1, 1],
				[0, 1, 0],
			];
  		} else if (type === "O") {
  			return [
				[2, 2],
				[2, 2],
			];
  		} else if (type === "L") {
  			return [
				[0, 3, 0],
				[0, 3, 0],
				[0, 3, 3],
			];
  		}   else if (type === "Z") {
  			return [
				[4, 4, 0],
				[0, 4, 4],
				[0, 0, 0],
			];
  		}    else if (type === "J") {
  			return [
				[0, 5, 0],
				[0, 5, 0],
				[5, 5, 0],
			];
  		}    else if (type === "I") {
  			return [
				[0, 6, 0, 0],
				[0, 6, 0, 0],
				[0, 6, 0, 0],
				[0, 6, 0, 0],
			];
  		}     else if (type === "S") {
  			return [
				[0, 7, 7],
				[7, 7, 0],
				[0, 0, 0],
			];
  		} 
  }




  //===function controlling the current postion of the items and the color of the canvas==
function  draw(){
	context.fillStyle = "#000";
	context.fillRect(0, 0, canvas.width, canvas.height);

	//====telling the js to add another matrix when it hits bottom
	drawMatrix(arena, {x: 0, y: 0});


	drawMatrix(player.matrix, player.pos);
}

//====function controlling the drawing of the matrix 
function drawMatrix(matrix, offset){
	matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value !== 0){
				context.fillStyle = colors[value];
				context.fillRect(x + offset.x,
							 y + offset.y,
							  1, 1);
			}
		})
	})
}

//=====function for combining the function of player and arena practically its copying the function in player to arena==
function merge(arena, player) {
	player.matrix.forEach((row, y) => {
		row.forEach((value, x) => {
			if(value !== 0){
				arena[y + player.pos.y][x + player.pos.x] = value;
			}
		});
	});
}




//===function telling the tetric=s game to move faster down when the down arrow has been clicked
function playerDrop(){
	player.pos.y++;
	//===connecting the collide function with the playeerdrop based on its results
	if(collide(arena, player)) {
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
	}
	dropCounter = 0;
};

//===function that disables the matrix from entering the border---ot takes direction(dir) as a parameter
function playerMove(dir){
	player.pos.x += dir;
	if(collide(arena, player)) {
		player.pos.x -= dir
	}
}

//====function that returns a random of the pieces at a time
function playerReset(){
	const pieces = 'ILJOTSZ';
	player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
	player.pos.y = 0;
	player.pos.x = (arena[0].length / 2 | 0) - 
					(player.matrix[0].length / 2 | 0);

    //==condition stating if the piecws get flled to the top - the game sshouldnt continue
	if (collide(arena, player)) {
		arena.forEach(row => row.fill(0));
		player.score = 0;
		updateScore();
	}
}




//==implementing the player rotate function into the matrix the function takes a direction(dir) as a parameter
function playerRotate(dir) {
	//==a function has been included that tells the matrix to not rotate inside the borders
	const pos = player.pos.x;
	let offset = 1;
	rotate(player.matrix, dir);
	while(collide(arena, player)) {
		player.pos.x += offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if(offset > player.matrix[0].length ) {
			rotate(player.matrix, -dir);
			return;
		}
	}
}

//====function that rotates the tetris matrix it takes a matrix and a dirx=ction as parameters
function rotate(matrix, dir) {
		for (let y = 0; y < matrix.length; ++y) {
			for (let x = 0; x < y; ++x) {
				[
					matrix[x][y],
					matrix[y][x],
				] = [
					matrix[y][x],
					matrix[x][y],
				];
			}
		}
		if (dir > 0) {
			matrix.forEach(row => row.reverse());
		} else {
			matrix.reverse();
		}
}


let dropCounter = 0;
let dropInterval = 1000;


//===The following maps out the color of the matrix
const colors = [
	null,
	'#FF0D72',
	'#0DC2FF',
	'#0DFF72',
	'#F538FF',
	'#FF8E0D',
	'#FFE138',
	'#3877FF',
];

//====trapping thefunction createMatrix inside a variable==
const arena = createMatrix(12, 20);


const player = {
	pos :  { x : 0, y : 0},
	matrix : null,
	score: 0,
}




  //===function controlling the keyboards keys
	document.addEventListener('keydown', event => {
		if(event.keyCode === 37) {
			//====disabling the matrix from entering the border
			playerMove(-1);
		}else if(event.keyCode === 39){
			playerMove(1);
		}else if(event.keyCode === 32){
			//===making the tetrix fall faster
			playerDrop();
		}else if(event.keyCode === 81) {
			//===rotating the matrix in reverse binding it to the "Q" key
			playerRotate(-1);
		}else if(event.keyCode === 87) {
			//===rotating the matrix in reverse binding it to the "W" key
			playerRotate(1);
		}
	});

//====function controlling the movement of tetrics icons every second

let lastTime = 0;
function update(time = 0){
	const deltaTime = time - lastTime;
	lastTime = time;

	dropCounter += deltaTime;
    if(dropCounter > dropInterval){
    	playerDrop();
	}
	draw();
	requestAnimationFrame(update);
}

	//==function that uofates the score
	function updateScore(){
		document.getElementById('score').innerText = player.score;
	}


playerReset();
updateScore();
update();