// Grid like Quadtree
// Start -> insert_tile into tree --> Node Tiles
// New units -> insert into tree --> Node Children --> Unit also get Node
// Remove Unit --> remove from tree
// In game --> unit performs periodic tree check
// If different Node --> remove and reinsert
var maxDepth = 3;
var maxChildren = 4;//8
var deepWidth;
var deepHeight;
var deepDim;
var tree_debug = true;
var tree_id = 0;
function QuadTree(width, height){
    this.nodes = [];
    this.reset();
    this.init(width, height);
}
QuadTree.prototype = {
    init: function(width, height){
        var root, parent;
        for(var depth = 0; depth < maxDepth; depth++){
            this.nodes[depth] = [];
            for(var j = 0; j < getDepthNum(depth); j++){
                if(depth == 0){
                    var node = new QuadNode(depth, j, null, null);
                    root = node;
                }else{
                    parent = this.nodes[depth-1][getParentIndex(depth, j)];
                    var node = new QuadNode(depth, j, parent, root);
                }
                this.nodes[depth].push(node);
            }
        }
    },
    reset: function(){
        deepWidth = getNodeWidth(maxDepth-1);
        deepHeight = getNodeHeight(maxDepth-1);
        deepDim = getDepthDim(maxDepth-1);

        for(var i = 0; i < this.nodes.length; i++){
            for(var j = 0; j < this.nodes[i].length; j++){
                this.nodes[i][j].reset();
            }
        }
    },
    update: function(){
      for(var depth = 0; depth < maxDepth; depth++){
        for(var j = 0; j < this.nodes[depth].length; j++){
            this.nodes[depth][j].update();
        }
      }
    },
    getNodes:function(item){
        item.getBound();
        gettreeBound(item); // gets index of tree it overlaps
        item.tree_nodes.length = 0;
        for(var i = item.i0; i <= item.i1 && i < deepDim; i++){
            for(var j = item.j0; j <= item.j1 && j < deepDim; j++){
                var node = this.nodes[maxDepth-1][deepDim*j + i];
                item.tree_nodes.push(node);
            }
        }
    },
    insert_tile:function(item){
        //getBound(item);
        getContainerBound(item);
        gettreeBound(item);
        if(item.j0 > 0) item.j0 = item.j0-1;
        for(var i = item.i0; i <= item.i1 && i < deepDim; i++){
            for(var j = item.j0; j <= item.j1 && j < deepDim; j++){
                var node = this.nodes[maxDepth-1][deepDim*j + i];
                //if(node.depth_index == 11) console.log(node.tiles.length)
                node.tiles.push(item);
            }
        }
    },
    remove_tile: function(item){
        //console.log('remove')
        for(var i = item.i0; i <= item.i1 && i < deepDim; i++){
            for(var j = item.j0; j <= item.j1 && j < deepDim; j++){
                var node = this.nodes[maxDepth-1][deepDim*j + i];
                for(var k = node.tiles.length - 1; k >= 0 ; k--){
                    if(node.tiles[k] == item) node.tiles.splice(k,1);
                }
            }
        }
    },
    remove_all_tiles: function(){
        for(var i = 0; i < this.nodes.length; i++){
            for(var j = 0; j < this.nodes[i].length; j++){
                this.nodes[i][j].tiles.length = 0;
            }
        }
    }, // end remove_all_tiles
    insert:function(item){
        //console.log('insert')
        this.getNodes(item);
        item.tree_nodes.forEach(function(n){
           n.activate(item);
        })
    },
    insert_all: function(item){
        this.getNodes(item);

        item.tree_nodes.forEach(function(n){
           n.activate_all(item);
        })
    }, // end insert
    check:function(item){
        item.getBound();
        return checktreeBound(item);
    },
    remove: function(item){
        //console.log('remove')
        item.tree_nodes.forEach(function(node){
            node.remove(item);
        });
        item.tree_nodes.length = 0;
    },
    retrieve: function(item){
        var out = []; var n = {};
        item.tree_nodes.forEach(function(node){
            node.retrieve(out, n);
        });
        return out;
    },
    retrieve_all: function(item){
        var out = []; var n = {};
        item.tree_nodes.forEach(function(node){
            node.retrieve_all(out, n);
        });
        return out;
        //console.log(out)
    }, // end retrieve
} // end QuadTree

function QuadNode(depth, depth_index, parent, root){
    this.depth = depth;
    this.depth_index = depth_index;
    this.parent = parent;
    this.root = root;
    this.active = false;
    this.drawn = false;
    this.children = [];
    this.tiles = [];
    this.init();
}
QuadNode.prototype = {
    init: function(){
        this.draw_create();
        this.reset();
    },
    reset: function(){
        var dim = getDepthDim(this.depth);
        this.width = getNodeWidth(this.depth);
        this.height = getNodeHeight(this.depth);
        this.x = (this.depth_index % dim)  * this.width;
        this.y = Math.floor(this.depth_index/dim) * this.height;
        this.draw();
        //this.x = this.depth_index
    },
    remove: function(item){
        var index = this.children.indexOf(item);
        if(index > -1){
            spliceOne(this.children, index);
        }
        if(this.children.length < 1){
            this.active = false;
            //this.update();
        }
        if(this.parent != null) this.parent.remove(item);
    },
    activate: function(item){
        this.children.push(item);
        if(tree_debug){
            this.active = true;
            //this.update();
        }
    },
    activate_all: function(item){
        //console.log('activate')
        this.activate(item);
        if(this.parent != null) this.parent.activate_all(item);
    },
    retrieve: function(out, n){
        this.children.forEach(function(c){
            if(!n[c.id]){
                n[c.id] = true;
                out.push(c);
            }
        })
    },
    // Start from the leave, go up the branch until a branch has too many childrens, stop before the root
    retrieve_all: function(out, n){
        var node = this.parent;
        var child = this;
        // Note: >= 1 will retrieve the root
        while(node.depth > 1){
            if(node.children.length >= maxChildren){
                node = child;
                break;
            }else{
                child = node;
                node = node.parent;
            }
        }
        //if(node == undefined) debugger;
        node.children.forEach(function(c){
            if(!n[c.id]){
                n[c.id] = true;
                out.push(c);
            }
        });
    }, // end retrieve
    update: function(){
        this.draw();
        /*if(this.active && !this.drawn){
            //stage.addChild(this.container);
            this.drawn = true;
        }else if(!this.active && this.drawn){
            //stage.removeChild(this.container);
            this.drawn = false;
        }*/
    },
    draw_create: function(){
        if(!tree_debug) return;
        //console.log('draw_create')
        this.draw();

        /*this.container = new PIXI.Container();
        this.container.type = ContainerType.QuadTreeDebug;
        this.grid = new PIXI.Graphics();

        var text = new PIXI.Text("" + this.depth_index, {font: '32px Arial', fill: 'black'})
        text.x = 0;
        text.y = 0;
        this.container.addChild(text);
        this.container.addChild(this.grid);*/
    },
    draw: function(){
        if(!tree_debug) return;
        //console.log('draw')
        //console.log(this.depth_index)
        //console.log(this.x + ", " + this.y)
        //console.log(this.width + ", " + this.height)

        rect(this.x, this.y, this.width, this.height);
    //if(this.depth_index == 0) debugger;
        text("" + this.depth_index, this.x + this.width/2, this.y + this.height/2)
        /*this.grid.clear();
        this.grid.lineStyle(width/500, 0xD25349, 1);
        this.container.x = this.x;
        this.container.y = this.y;
        this.grid.drawRect(0, 0, this.width, this.height);*/
    },
} // end QuadNode
var getDepthNum = function(depth){
    switch(depth){
        case 0: return 1;
        case 1: return 4;
        case 2: return 16;
        case 3: return 64;
        case 4: return 256;
        case 5: return 1024;
    }
}
var getDepthDim = function(depth){
    switch(depth){
        case 0: return 1;
        case 1: return 2;
        case 2: return 4;
        case 3: return 8;
        case 4: return 16;
        case 5: return 32;
    }
}
var getDepth = function(index){
    if(index <= 0) return 0;
    if(index <= 4) return 1;
    if(index <= 20) return 2;
    if(index <= 84) return 3;
    if(index <= 340) return 4;
    if(index <= 1634) return 5;
}
var getNodeWidth = function(depth){
    switch(depth){
        case 0: return stageWidth / 1;
        case 1: return stageWidth / 2;
        case 2: return stageWidth / 4;
        case 3: return stageWidth / 8;
        case 4: return stageWidth / 16;
        case 5: return stageWidth / 32;
    }
}
var getNodeHeight = function(depth){
    switch(depth){
        case 0: return stageHeight / 1;
        case 1: return stageHeight / 2;
        case 2: return stageHeight / 4;
        case 3: return stageHeight / 8;
        case 4: return stageHeight / 16;
        case 5: return stageHeight / 32;
    }
}
var getParentIndex = function(depth, index){
    var dim = getDepthDim(depth);
    var row = Math.floor(index / dim / 2);
    var col = Math.floor((index % dim) / 2);
    return row*dim/2 + col;
}

var gettreeBound = function(item){
    item.i0 = Math.floor(item.left  / deepWidth);
    if(item.i0 < 0) item.i0 = 0;
    item.j0 = Math.floor(item.top   / deepHeight);
    if(item.j0 < 0) item.j0 = 0;
    item.i1 = Math.floor(item.right / deepWidth);
    // deepDim = 8
    if(item.i1 > deepDim) item.i1 = deepDim;
    item.j1 = Math.floor(item.bot   / deepHeight);
    if(item.j1 > deepDim) item.j1 = deepDim;
}
var checktreeBound = function(item){
    var i0 = Math.floor(item.left  / deepWidth);
    if(i0 < 0) i0 = 0;
    if(i0 != item.i0) return false;
    var j0 = Math.floor(item.top   / deepHeight);
    if(j0 < 0) j0 = 0;
    if(j0 != item.j0) return false;
    var i1 = Math.floor(item.right / deepWidth);
    if(i1 > deepDim) i1 = deepDim;
    if(i1 != item.i1) return false;
    var j1 = Math.floor(item.bot   / deepHeight);
    if(j1 > deepDim) j1 = deepDim;
    if(j1 != item.j1) return false;
    return true;
}

var update_tree = function(tree, obj){
    obj.tree_update_count++;
    if(obj.tree_update_count < obj.tree_update_time) return;
    obj.tree_update_count = 0;
    if(!tree.check(obj)){
        tree.remove(obj);
        tree.insert(obj);
    }
}
