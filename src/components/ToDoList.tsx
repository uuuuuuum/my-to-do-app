import React from "react";
import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { Categories, categoriesState, categoryState, ICategory, IToDo, toDoSelector, toDoState } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

const Container = styled.div`
    margin: 0 auto;
    max-width: 650px;
    font-size: 14px;
`;

const Header = styled.header`
    padding: 20px;
`;

const Title = styled.h1`
    font-size: 36px;
    text-align: center;
`;

const FixedBtnWrapper = styled.div`
    padding: 10px;
    position: absolute;
    bottom: 10px;
    left: 10px;
`
const BtnTheme = styled.button`
    width: 48px;
    height: 48px;
    color: white;
    background-color: ${props => props.theme.accentColor};
    border-radius: 50%;
`;

const ToDoFormWrapper = styled.div`
    padding: 20px;
    background-color: #424242;
    & > * { 
        display: flex;
        align-items: center;
    }

    & > * + * {
        margin-top: 16px;
    }

    input, select {
        flex: 1;
        padding: 0 8px;
        height: 36px;
        box-sizing: border-box;
        border-radius: 4px;
        border: 0;
        min-width: 200px;
    }
    
    button { 
        flex: 0 0 auto;
        margin-left: 8px;
        padding: 0 24px;
        height: 36px;
        background-color: #ffffff;
        border-radius: 4px;
    }
    label {
        min-width: 130px;
        font-size: 18px;
    }
`;
const ToDoBoxWrapper = styled.div`
    padding: 30px;
    background-color: #515050;
`;

function ToDoList() {
    const toDos = useRecoilValue(toDoSelector);

    const [category, setCategory] = useRecoilState(categoryState);
    const onInput = (event:React.FormEvent<HTMLSelectElement>) => {
        setCategory(event.currentTarget.value as any);
    }

    const [categories, setCategories] = useRecoilState(categoriesState);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ICategory>();
    const AddToCategoryFn = ({addCategory}: ICategory) => {
        setCategories(oldCategories => [
            { text: addCategory, id: Date.now(), category: addCategory.toUpperCase().replace(" ", "_") },
            ...oldCategories
        ]);
        setValue("addCategory","");
    }

    return (
        <Container>
            <Helmet><title>To Dos</title></Helmet>
            <Header>
                <Title>To Dos</Title>
            </Header>
            <ToDoFormWrapper>
                <form onSubmit={handleSubmit(AddToCategoryFn)}>
                    <label htmlFor="aCtg">Add Category</label>
                    <input id="aCtg" {...register("addCategory", {
                    required: "Please wirte Category"}
                    )} placeholder="Add to Category" />
                    <button>Add</button>
                    <span>{ errors?.addCategory?.message }</span>
                </form>
                <div>
                    <label htmlFor="ctg">Category</label>
                    <select id="ctg" value={category} onInput={onInput}>
                        <option value={Categories.TO_DO}>To Do</option>
                        <option value={Categories.DOING}>Doing</option>
                        <option value={Categories.DONE}>Done</option>
                        {categories?.map(category => <option key={category.id} value={category.category}>{category.text}</option>)}
                    </select>
                </div>
                <CreateToDo />
            </ToDoFormWrapper>
            <ToDoBoxWrapper>
                <p>{category}</p>
                <ul>
                    {toDos?.map(toDo =><ToDo key={toDo.id} {...toDo}></ToDo>)}
                </ul>
            </ToDoBoxWrapper>

            <FixedBtnWrapper>
                <BtnTheme>Light</BtnTheme>
            </FixedBtnWrapper>
        </Container>
    );
}

export default ToDoList;