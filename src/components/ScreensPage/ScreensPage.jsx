import './screensPage.scss';
import PopUp from 'components/modal/PopUp';
// import { useState } from 'react';
import Columns from '../columns/Columns';
import Icon from '../icon/Icon';
import FilterPopup from 'components/filterPopup/FilterPopup';
import { DragDropContext } from 'react-beautiful-dnd';
// import { themeState } from 'redux/theme/themeSlice';
import {
  selectCurrentTheme,
  // selectCurrentUserBoards,
} from 'redux/auth/auth-slice';
import { useSelector } from 'react-redux';
import ColumnForm from 'components/columnForm/ColumnForm';
// import { useState } from 'react';
// import { useParams } from 'react-router-dom';
import {
  selectColumns,
  setColumn,
  // selectCurrentBoard,
} from 'redux/workplace/workplace-slice';
import { useDispatch } from 'react-redux';
import { dragTaskById } from 'redux/workplace/workplace-operation';

//temporary
// const columnsArray = [
//   { title: 'To Do', id: 1 },
//   { title: 'In progress', id: 2 },
//   { title: 'Done', id: 3 },
//   { title: 'Done', id: 4 },
//   { title: 'Done', id: 5 },
//   { title: 'Done', id: 6 },
//   { title: 'Done', id: 7 },
//   { title: 'Done', id: 8 },
// ];
// const boardArray = [
//   { title: 'To Do List', id: '1hk677' },
//   { title: 'Home', id: '289kl0' },
//   { title: 'Family', id: '34g56' },
//   { title: 'Garden tree', id: '48hjk90' },
//   { title: 'Project', id: '51gjj24' },
//   { title: 'English', id: '6fgh678' },
//   { title: 'Shopping', id: '73bnm45' },
// ];

const ScreensPage = () => {
  const currentTheme = useSelector(selectCurrentTheme);
  // const boardArray = useSelector(selectCurrentBoard);
  const dispatch = useDispatch();
  const columnsArray = useSelector(selectColumns);

  // const { boardName } = useParams();
  // const [currentBoardTitle, setCurrentBoard] = useState('');

  // useEffect(() => {
  //   const foundBoard = boardArray.find(item => item.id === boardName);
  //   foundBoard ? setCurrentBoard(foundBoard.title) : setCurrentBoard('');
  // }, [boardName]);

  const dragHandler = async res => {
    if (!res.destination) {
      return;
    }
    const sourceListIndex = columnsArray.findIndex(
      el => el._id === res.source.droppableId
    );
    const destinationListIndex = columnsArray.findIndex(
      el => el._id === res.destination.droppableId
    );

    const updatedSourceTasks = [...columnsArray[sourceListIndex].tasks];
    const updatedDestinationTasks = [
      ...columnsArray[destinationListIndex].tasks,
    ];

    const [movedTask] = updatedSourceTasks.splice(res.source.index, 1);

    if (sourceListIndex === destinationListIndex) {
      updatedSourceTasks.splice(res.destination.index, 0, movedTask);
    } else {
      updatedDestinationTasks.splice(res.destination.index, 0, movedTask);
    }

    const updatedData = [...columnsArray];
    updatedData[sourceListIndex] = {
      ...updatedData[sourceListIndex],
      tasks: updatedSourceTasks,
    };
    if (sourceListIndex !== destinationListIndex) {
      updatedData[destinationListIndex] = {
        ...updatedData[destinationListIndex],
        tasks: updatedDestinationTasks,
      };
    }

    dispatch(setColumn(updatedData));

    dispatch(
      dragTaskById({
        id: movedTask._id,
        columnId: res.destination.droppableId,
        indexTo: res.destination.index,
        indexFrom: res.source.index,
      })
    );
  };

  return (
    <div className={`theme-${currentTheme} screenPage`}>
      <div className={`screenPage_header theme-${currentTheme}`}>
        <h1 className={`screenPage_title theme-${currentTheme}`}>
          {/* {currentBoardTitle} */}
        </h1>
        <PopUp
          data={
            <span className={`screenPage_filter theme-${currentTheme}`}>
              <Icon id={'filter'} width={16} height={16} />
              <span className={`screenPage_filterText theme-${currentTheme}`}>
                Filter
              </span>
            </span>
          }
        >
          <FilterPopup />
        </PopUp>
      </div>

      <div className={`screenPage_canvas theme-${currentTheme}`}>
        <ul className={`screenPage_columns theme-${currentTheme}`}>
          <DragDropContext onDragEnd={dragHandler}>
            {columnsArray.map(item => (
              <Columns {...item} key={item._id} />
            ))}
          </DragDropContext>
        </ul>

        <PopUp
          data={
            <span className={`screenPage_addButton theme-${currentTheme}`}>
              <span
                className={`screenPage_addButtonPlus theme-${currentTheme}`}
              >
                <Icon id={'plus'} width={14} height={14} />
              </span>
              <span
                className={`screenPage_addButtonText theme-${currentTheme}`}
              >
                Add another column
              </span>
            </span>
          }
        >
          <ColumnForm />
        </PopUp>
      </div>
    </div>
  );
};

export default ScreensPage;
