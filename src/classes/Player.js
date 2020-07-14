import Board from './Board';

/**
  * @desc This class represents the computer player, contains a single method that uses minimax to get the best move
  * @param {Number} max_depth - limits the depth of searching
  * @param {Map} nodes_map - stores the heuristic values for each possible move
*/
class Player 
{
	constructor(max_depth = -1)
	{
        this.max_depth = max_depth;
        this.nodes_map = new Map();
    }
    /**
     * Uses minimax algorithm to get the best move
     * @param {Object} board - an instant of the board class
     * @param {Boolean} maximizing - whether the player is a maximizing or a minimizing player
     * @param {Function} callback - a function to run after the best move calculation is done
     * @param {Number} depth - used internally in the function to increment the depth each recursive call
     * @return {Number} the index of the best move
     */
	getBestMove(board, maximizing = true, callback = () => {}, depth = 0) 
	{
		//Throw an error if the first argument is not a board

		if(board.constructor.name !== "Board") throw('The first argument to the getBestMove method should be an instance of Board class.');
		
		//clear nodes_map if the function is called for a new move

		if(depth == 0) this.nodes_map.clear();

		//If the board state is a terminal one, return the heuristic value

		if(board.isTerminal() || depth == this.max_depth ) {
			if(board.isTerminal().winner == 'x') {
				return 100 - depth;
			} else if (board.isTerminal().winner == 'o') {
				return -100 + depth;
			} 
			return 0;
		}

		//var weights = [ 0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 ]; // HAVE TO DECIDE WEIGHTS

		

		//Current player is maximizing
		if(maximizing) 
		{
			//Initialise best to the lowest possible value
			let best = -100;
			//Loop through all empty cells
			board.getAvailableMoves().forEach(index => 
			{
				//Initialise a new board with the current state 

				let child = new Board(board.state.slice());

				//Create a child node by inserting the maximizing symbol x into the current empty cell

				child.insert('x', index);

				
				//Recursively calling getBestMove this time with the new board and minimizing turn and incrementing the depth

				let node_value = this.getBestMove(child, false, callback, depth + 1, alpha, beta);

				//Updating best value

				best = Math.max(best, node_value);  // * weights[index] NEED TO THINK ABOUT THIS
				
				//If it's the main function call, not a recursive one, map each heuristic value with it's moves indicies

				if(depth == 0) 
				{
					//Comma seperated indicies if multiple moves have the same heuristic value

					var moves = this.nodes_map.has(node_value) ? `${this.nodes_map.get(node_value)},${index}` : index;
					this.nodes_map.set(node_value, moves);
				}
			});

			//If it's the main call, return the index of the best move or a random index if multiple indicies have the same value

			if(depth == 0) 
			{
				if(typeof this.nodes_map.get(best) == 'string')
				{
					var arr = this.nodes_map.get(best).split(',');
					var rand = Math.floor(Math.random() * arr.length);
					var ret = arr[rand];
				} 
				else 
				{
					ret = this.nodes_map.get(best);
				}

				//run a callback after calculation and return the index

				callback(ret);
				return ret;
			}

			//If not main call (recursive) return the heuristic value for next calculation

			return best;
		}

		if(!maximizing) 
		{
			//Initialise best to the highest possible value

			let best = 100;

			//Loop through all empty cells

			board.getAvailableMoves().forEach(index => 
			{
				//Initialize a new board with the current state 

				let child = new Board(board.state.slice());

				//Create a child node by inserting the minimizing symbol o into the current emoty cell

				child.insert('o', index);

							
				//Recursively calling getBestMove this time with the new board and maximizing turn and incrementing the depth

				let node_value = this.getBestMove(child, true, callback, depth + 1, alpha, beta);

				//Updating best value

				best = Math.min(best, node_value);
								
				//If it's the main function call, not a recursive one, map each heuristic value with it's moves indicies

				if(depth == 0) 
				{
					//Comma seperated indicies if multiple moves have the same heuristic value

					var moves = this.nodes_map.has(node_value) ? this.nodes_map.get(node_value) + ',' + index : index;
					this.nodes_map.set(node_value, moves);
				}
			});

			//If it's the main call, return the index of the best move or a random index if multiple indicies have the same value

			if(depth == 0)
			{
				if(typeof this.nodes_map.get(best) == 'string') 
				{
					var arr = this.nodes_map.get(best).split(',');
					var rand = Math.floor(Math.random() * arr.length);
					var ret = arr[rand];
				} 
				else
				{
					ret = this.nodes_map.get(best);
				}

				//run a callback after calculation and return the index

				callback(ret);
				return ret;
			}
			
			//If not main call (recursive) return the heuristic value for next calculation
			return best;
		}

	}
}

export default Player;