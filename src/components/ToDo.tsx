import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Categories, categoriesState, ICategory, IToDo, toDoState } from "../atoms";

const ToDoBox = styled.li`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;
    background-color: ${props => props.theme.boxInnerColor};
    border-bottom: 1px solid ${props => props.theme.boxBdColor};
    list-style: none;

    span { 
        margin-right: 10px; 
        min-width: 40%;
        font-size: 1.1em;

        &:before {
            content: "- ";
        }
    }
    button { 
        margin-top: 8px;
        margin-right: 5px;
        padding: 0 8px;
        height: 28px;
        line-height: 28px;
        color: white;
        background-color: ${props => props.theme.accentColor};
        border: 0;
        border-radius: 2px;
        cursor: pointer;

        &:hover {
            opacity: 0.8;
        }
    }
`;

function ToDo({ text, id, category }: IToDo) {
    const setToDos = useSetRecoilState(toDoState);
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { 
            currentTarget: { name }, 
        } = event;
        setToDos(oldToDos => {
            const targetIndex = oldToDos.findIndex(toDo => toDo.id === id);
            const newToDo = { text, id, category: name as any };

            // 버튼 클릭시 투두리스트용 로컬스토리지 데이터 카테고리가 변경 됨
            window.localStorage.setItem("toDoitems", JSON.stringify([
                ...oldToDos.slice(0, targetIndex),
                newToDo,
                ...oldToDos.slice(targetIndex + 1)
            ]));

            return [
                ...oldToDos.slice(0, targetIndex),
                newToDo,
                ...oldToDos.slice(targetIndex + 1)
            ];
        });
    }

    const categories = useRecoilValue(categoriesState);

    return (
        <ToDoBox>
            <span>{text}</span>
            <div>
                {category !== Categories.TO_DO && (
                    <button name={Categories.TO_DO} onClick={onClick}>To Do</button> 
                )}
                {category !== Categories.DOING && (
                    <button name={Categories.DOING} onClick={onClick}>Doing</button>
                )}
                {category !== Categories.DONE && (
                    <button name={Categories.DONE} onClick={onClick}>Done</button>
                )}
                {categories?.map(cate => 
                    category !== cate.category && <button key={cate.id} name={cate.category} onClick={onClick}>{cate.text}</button>
                )}
            </div>
        </ToDoBox>
    );
}

export default ToDo;