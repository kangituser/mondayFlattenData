/**
 * @description grapQL Querries
 */
const getBoards = require('../gql/boards');
const getItems = require('../gql/items');

/**
 * @description DAL Querries
 */
const cearteDependencies = require('../DAL/dependencies');
const creatItems = require('../DAL/item');

/** 
 * @description the relevant folder ID to work on 
 * in the future this will be based on a query to the database 
 * (when there are more folders -> they are stored in a table named 'Folders')
 */
const { FOLDER_ID } = process.env;

/** 
 * @description
 * in the future this function will receive an array of Folder Id's 
 * (making this whole process go one layer up)
 */
const FilterRelevantBoardIDs = ALL_BOARDS => {
  try {
    const BOARDS = ALL_BOARDS.filter(({ board_folder_id }) => board_folder_id === +FOLDER_ID);
    return BOARDS.map(({ id }) => +id);
  } catch (err) {
    throw err;
  }
}

/** 
 * @description returns a tree of:
 * @param { boards => items => groups => column vales } 
 * to be remapped
 * 
 * note: the treeNodes is not flat, hence the 'flat()' method...
 */
const getGroupItems = async BOARD_IDS => {
  try {
    return await Promise.all(BOARD_IDS.map(async id => {
      let { data } = await getItems(id);
      return data.data.boards;
    }))  
  } catch (err) {
    throw err;
  }
}

/**
 * @description gets the group array and a groupId => returns a boolean
 * if exists => true
 * if does not exist => false
 */
const checkIfGroupExists = (groups, groupId) => {
   return Boolean(groups.find(group => group.groupId === groupId));
}

/**
 * @description a function the returns a mapped tree representation
 * of the boards data
 */
const mapTree = TREE => {
  try {
    let mappedTREE = [];

    TREE.forEach(board => {
      let boardId = board.id;
      let boardName = board.name;
      let groups = [];

      board.items.forEach(item => {
        if (groups.length === 0) {
          groups.push({ groupId: item.group.id, groupTitle: item.group.title, items: [] });
        } 
          
        if (!checkIfGroupExists(groups, item.group.id)) {
          groups.push({ groupId: item.group.id, groupTitle: item.group.title, items: [] });
        } 
      });

      board.items.forEach(item => {
        let found = groups.find(group => group.groupId === item.group.id);
        groups.forEach((group, idx) => {
          if (group.groupId === found.groupId) {
            groups[idx].items.push(item);
          }
        })  
      })

      mappedTREE.push({ boardId, boardName, groups: groups });
    })
    return mappedTREE;
  } catch (err) {
    throw err;
  }
}

/**
 * @description a funtction to remap rows to fit database
 * @note this function remaps all items on the TREE structure
 */
const remapItems = mappedTREE => {
  try {
    // console.log(mappedTREE[9].groups[1].items)
    let flattenedTREE = [];
    mappedTREE.forEach(board => {
      board.groups.forEach(group => {
        let mappedItems = mapGroupItems(group.items, board.boardId, board.boardName);
        flattenedTREE.push(mappedItems.flat()) ;
      })
    })
    
    return flattenedTREE.flat();
  } catch (err) {
    throw err;
  }
}

/**
 * @description a funtction to iterate over all items in a group
 */
const mapGroupItems = (groupItems, boardId, boardName) => groupItems.map(items => mapItemColumValues(items, boardId, boardName));

/**
 * @description handle monady.com/graphql multiple person column
 * in case there is more than one person in charge
 */
const handlePerson = person => {
  if (person.includes(',')) {
    return person.split(',');
  } else {
    return [person];
  }
}

/**
 * @description handles time ranges to a @param { from, to } object
 */
const handleTimeRange = (timerange) => {
  const [from, to] = timerange.split(' - ');
  if (!from && !to) {
    return { from: undefined, to: undefined };
  }
  return { from: from , to: to };
}

/**
 * @description handle dependency columns
 */
const dependency = ({ text : itemName, value }) => {
  
  if (!value) {
    return [{ itemName: undefined, mondayItemId: undefined }]; 
  }

  const { linkedPulseIds } = JSON.parse(value);
  
  if (!linkedPulseIds) {
    return [{ itemName: undefined, mondayItemId: undefined }]; 
  }

  if (linkedPulseIds.length === 1) {
    return [{
      mondayItemId: linkedPulseIds[0].linkedPulseId,
      itemName: itemName
    }]
  } else {
    return linkedPulseIds.map((lPId, idx) => {
      return { 
        mondayItemId: lPId.linkedPulseId,
        itemName: itemName.split(',')[idx]
      }
    });
  }
}

/**
 * @description funtction to handle difference in days of boath dates & deviation
 */
const daysDiff = (from, to, type) => {
  if (!from || !to) {
    return undefined;
  }

  let dateFrom = new Date(from);
  let dateTo = new Date(to);
  let difference = dateTo - dateFrom;
  let days = type === 'deviation' ? Math.ceil(difference / (1000 * 3600 * 24)) : Math.ceil(difference / (1000 * 3600 * 24)) + 1;
   
  return days;
}

/**
 * @description main function to map all column values of a single item
 * @note : the person in charge does not work perfectly,
 * so it will be handled in a later function
 */
const mapItemColumValues = (item, boardId, boardName) => {
  const itemValues = {
    folderId: process.env.FOLDER_ID,
    boardId: boardId,
    boardName: boardName,
    groupName: item.group.title,
    groupId: item.group.id,
    itemId: item.id,
    itemName: item.name,
    personInCharge: '',
    plannedWorkTimeStart: '',
    plannedWorkTimeEnd: '',
    deFactoWorkTimeStart: '',
    deFactoWorkTimeEnd: '',
    plannedWorkTimeGoal: '',
    deFactoWorkTimeGoal: '',
    status: '',
    dependency: '',
    deviation: '',
    comments: ''
  }
    
  item.column_values.forEach(column => {
    switch (column.id) {
      case 'person': // preson in charge
          itemValues.personInCharge = handlePerson(column.text);
        break;
      case '__________': { // planned work hours
        const { from, to } = handleTimeRange(column.text);
          itemValues.plannedWorkTimeStart = from;
          itemValues.plannedWorkTimeEnd = to;
      }
      break;
      case 'timeline6': { // de facto work hours
        const { from, to } = handleTimeRange(column.text);
        itemValues.deFactoWorkTimeStart = from;
        itemValues.deFactoWorkTimeEnd = to;
      }
        break;
      case '_________': // planned work hours goal
        itemValues.plannedWorkTimeGoal = daysDiff(itemValues.plannedWorkTimeStart ,itemValues.plannedWorkTimeEnd);
        break;
      case '_________8': // work hours goals
        itemValues.deFactoWorkTimeGoal = daysDiff(itemValues.deFactoWorkTimeStart, itemValues.deFactoWorkTimeEnd);
        break;
      case 'dependent_on1': //dependencies
        itemValues.dependency = dependency(column);
        break;
      case '_________3': //deviation
        itemValues.deviation = daysDiff(itemValues.plannedWorkTimeEnd, itemValues.deFactoWorkTimeEnd, 'deviation');
        break;
      case 'text': // comments
        itemValues.comments = column.text;
        break;
      case 'status': // status
        itemValues.status = column.text;
        break;
      default:
        return;
    }
  }) 
  
  return itemValues;
}

/**
 * @description a main function to handle persistence 
 * 1. send to item creation
 * 2. send to relation creation
 */
const mapPersonAndDependencies = flatTREE => {
  let ITEMS = flatTREE.map(item => itemCreation(item))
  let relations = flatTREE.map(item => relationCreation(item))
  let flatRELATIONS = relations.flat()
  const mappedRELATIONS = flatRELATIONS.filter(({ parentId }) => parentId);
  const RELATIONS = mappedRELATIONS.map(relation => {
    return { ...relation, parentId: relation.parentId.toString() }
  })
  
  return [ITEMS.flat(), RELATIONS]
}

/**
 * @description persist item to DB based on number of persons in charge
 */
const itemCreation = item => {
  
  let NUM_OF_ROWS = item.personInCharge.length;
  let ITERATIONS = Array.from({ length: NUM_OF_ROWS }, (_, idx) => idx);

  let ROWS = [];

  ITERATIONS.forEach(idx => {
    ROWS.push(mapRowItem(item, idx));
  })
  
  return ROWS.flat()
}

 /**
  * @description persist to DB based on number of dependencies
  */
const relationCreation = item => {
  return item.dependency.map(dep => {
    return {
      childId: item.itemId,
      parentId: dep && dep.mondayItemId,
    }
  })
}

/**
 * @description map dates for DB
 */
const mapDate = date => {
  if (!date) {
    return undefined;
  }
  return new Date(date).toISOString().split('T')[0];
  // return new Date(date).toISOString().split('T')[0];
}

/**
 * @description map item by person in charge
 */
 const mapRowItem = (item, index) => {
   return {
    folderId: item.folderId,
    boardId: item.boardId,
    boardName: item.boardName,
    groupName: item.groupName,
    groupId: item.groupId,
    itemId: item.itemId,
    itemName: item.itemName,
    personInCharge: item.personInCharge[index],
    plannedWorkTimeStart: mapDate(item.plannedWorkTimeStart),
    plannedWorkTimeEnd: mapDate(item.plannedWorkTimeEnd),
    deFactoWorkTimeStart: mapDate(item.deFactoWorkTimeStart),
    deFactoWorkTimeEnd: mapDate(item.deFactoWorkTimeEnd),
    plannedWorkTimeGoal: item.plannedWorkTimeGoal,
    deFactoWorkTimeGoal: item.deFactoWorkTimeGoal,
    status: item.status,
    // dependency: item.dependency,
    deviation: item.deviation,
    comments: item.comments
   }
 }

const _main = async () => {
  try {
    const data = await getBoards();
    
    const BOARD_IDS = FilterRelevantBoardIDs(data.data.data.boards);
    
    const TREE = await getGroupItems(BOARD_IDS);
    
    const mappedTREE = mapTree(TREE.flat());
    
    const flattenedTREE = remapItems(mappedTREE);
    
    const [itemsForBulk, dependenciesForBulk] = mapPersonAndDependencies(flattenedTREE);
    
    creatItems(itemsForBulk);

    cearteDependencies(dependenciesForBulk);

    return true;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  _main
}