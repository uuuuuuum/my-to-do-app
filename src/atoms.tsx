import { atom, selector } from "recoil";

//for LocalStorage
const getToDoitems = window.localStorage.getItem("toDoitems");
const getAddedCategories = window.localStorage.getItem("addedCategories");

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
export const toDoState = atom<IToDo[]>({
    key: "toDo",
    default: getToDoitems !== null ? JSON.parse(getToDoitems) : []
});
export const categoryState = atom<Categories>({
    key: "category",
    default: Categories.TO_DO,
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
    default: getAddedCategories !== null ? JSON.parse(getAddedCategories) : [],
});
/* For create new category */


// For Title Category
export const categoryTextState = atom<string>({
    key: "categoryText",
    default: "To Do",
});

// Theme Toggle
export const isDarkState = atom<boolean>({
    key: "toggletheme",
    default: false,
});

// label show true false
export const isShowLabelState = atom<boolean>({
    key: "labelShow",
    default: window.innerWidth > 480 ? true : false
});

