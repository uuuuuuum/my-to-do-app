import React from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import styled from "styled-components";
import { Categories, categoriesState, ICategory, IToDo, toDoState } from "../atoms";

const ToDoBox = styled.li`
    margin: 10px 0;
    padding: 10px;
    background-color: ${props => props.theme.boxColor};
    list-style: none;
    border-radius: 4px;

    span { margin-right: 10px; }
    button { 
        margin-left: 5px;
        padding: 4px 8px;
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

function ToDo({ text, category, id }: IToDo) {
    const setToDos = useSetRecoilState(toDoState);
    const onClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { 
            currentTarget: { name }, 
        } = event;
        setToDos(oldToDos => {
            const targetIndex = oldToDos.findIndex(toDo => toDo.id === id);
            const newToDo = { text, id, category: name as any };

            window.localStorage.setItem("ourLocalItems", JSON.stringify([
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
            {category !== Categories.DOING && (
                <button name={Categories.DOING} onClick={onClick}>Doing</button>
            )}
            {category !== Categories.TO_DO && (
                <button name={Categories.TO_DO} onClick={onClick}>To Do</button> 
            )}
            {category !== Categories.DONE && (
                <button name={Categories.DONE} onClick={onClick}>Done</button>
            )}
            {categories?.map(cate => 
                category !== cate.category && <button key={cate.id} name={cate.category} onClick={onClick}>{cate.text}</button>
            )}
        </ToDoBox>
    );
}

export default ToDo;