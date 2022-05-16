import { atom, selector } from "recoil";
//for LocalStorage
const getItem = window.localStorage.getItem("ourLocalItems");

export enum Categories {
    "TO_DO" = "TO_DO",
    "DOING" = "DOING",
    "DONE" = "DONE",
};

export interface IToDo {
    text: string;
    id: number;
    category: Categories;
};
export const categoryState = atom<Categories>({
    key: "category",
    default: Categories.TO_DO,
});

export const toDoState = atom<IToDo[]>({
    key: "toDo",
    default: getItem !== null ? JSON.parse(getItem) : []
});

export const toDoSelector = selector({
    key: "toDoSelector",
    get: ({get}) => {
        const toDos = get(toDoState);
        const category = get(categoryState);
        return toDos.filter(toDo => toDo.category === category);
    }
});

/* For create new category */
export interface ICategory {
    addCategory: string;
}
export interface ICategories {
    text: string;
    id: number;
    category: string;
};
export const categoriesState = atom<ICategories[]>({
    key: "categories",
    default: getItem !== null ? JSON.parse(getItem) : [],
});