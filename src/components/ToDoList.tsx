import { Helmet } from "react-helmet";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { Categories, categoriesState, categoryState, categoryTextState, ICategory, isDarkState, isShowLabelState, toDoSelector } from "../atoms";
import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";

const Container = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 30px;
    max-width: 650px;
    font-size: 14px;
    height: 100vh;
    overflow: hidden;

    @media screen and (max-width: 480px) {
        padding: 20px 0;
    }
`;

const Header = styled.header`
    margin-bottom: 20px;
`;

const Title = styled.h1`
    color: ${(props) => props.theme.titleColor};
    font-size: 36px;
    font-weight: bold;
    text-align: center;
    background: ${(props) => `linear-gradient(to right, ${props.theme.accentColor}, rgb(126 60 121))`};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
`;

const FixedBtnWrapper = styled.div`
    position: absolute;
    bottom: 10px;
    left: 10px;
`
const BtnTheme = styled.button<{isDark:boolean}>`
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: ${props => props.isDark ? "linear-gradient(45deg, #fffbab, #ffffff)" : "linear-gradient(45deg, #242737, #804e9e)"};
    color: ${props => props.isDark ? "black" : "white"};
    font-weight: bold;
    letter-spacing: -0.5px;

    @media screen and (max-width: 480px) {
        width: 40px;
        height: 40px;
        font-size: 0.8em;
    }
`;

const ToDoFormWrapper = styled.div`
    flex: 0 0 auto;
    padding: 20px;
    background-color: ${(props) => props.theme.boxColor};
    border-bottom: 1px solid ${(props) => props.theme.boxBdColor};
    border-radius: 8px 8px 0 0;
    & > * { 
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

    & > * + * {
        margin-top: 16px;
    }

    input, select {
        flex: 1;
        padding: 0 8px;
        height: 36px;
        color: ${(props) => props.theme.textColor };
        background-color: ${(props) => props.theme.inputBgColor };
        border: 1px solid ${(props) => props.theme.inputBdColor };
        border-radius: 4px;
        box-sizing: border-box;
        outline-color: ${(props) => props.theme.accentColor };
    }
    
    button { 
        flex: 0 0 auto;
        margin-left: 8px;
        padding: 0 24px;
        height: 36px;
        color: white;
        background-color: ${(props) => props.theme.accentColor };
        border-radius: 4px;

        @media screen and (max-width: 320px) {
            padding: 0 16px;
        }
    }

    label {
        min-width: 105px;
    }

    span {
        margin-top: 8px;
        width: 100%;
        font-size: 0.9em;
        font-weight: 200;
        text-align: right;
        letter-spacing: 1px;
        opacity: 0.6;
    }
`;
const ToDoBoxWrapper = styled.div`
    flex: 1;
    padding: 30px;
    background-color: ${(props) => props.theme.boxColor};
    overflow-y: auto;
    border-radius: 0 0 8px 8px;

    & > p {
        margin-bottom: 20px;
        text-align: center;
        font-size: 1.2em;
        font-weight: 500;

        @media screen and (max-width: 480px) {
            margin-bottom: 10px;
        }
    }

    @media screen and (max-width: 480px) {
        padding: 15px;
    }
`;

function ToDoList() {
    const [isDark, setIsDark] = useRecoilState(isDarkState);
    const ToggleTheme = () => {
        setIsDark((current) => !current);
    }
    const toDos = useRecoilValue(toDoSelector);
    const [category, setCategory] = useRecoilState(categoryState);
    const onInput = (event:React.FormEvent<HTMLSelectElement>) => {
        setCategory(event.currentTarget.value as any);

        const selectedIndex = event.currentTarget.selectedIndex;
        setCategoryText(event.currentTarget.children[selectedIndex].textContent as any);
    }
    
    // 선택된 카테고리 타이틀용도로 추가
    const [categoryText, setCategoryText] = useRecoilState(categoryTextState);

    // 코드챌린지 - 사용자 추가 카테고리용
    const [categories, setCategories] = useRecoilState(categoriesState);
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ICategory>();
    const AddToCategoryFn = ({addCategory}: ICategory) => {
        setCategories(oldCategories => {
            // 로컬스토리지에 데이터 담기 => 애드카테고리용
            window.localStorage.setItem("addedCategories", JSON.stringify([
                ...oldCategories,
                { text: addCategory, id: Date.now(), category: addCategory.toUpperCase().replace(" ", "_") }
            ]));

            return [
                ...oldCategories,
                { text: addCategory, id: Date.now(), category: addCategory.toUpperCase().replace(" ", "_") }
            ]
        });
        setValue("addCategory","");
    }

    // label show true false
    const [isShowLabel, SetisShowLabel] = useRecoilState(isShowLabelState);
    window.addEventListener("resize", () => {
        SetisShowLabel(window.innerWidth > 480 ? true : false);
    });

    return (
        <Container>
            <Helmet><title>To Dos</title></Helmet>
            <Header>
                <Title>To Dos</Title>
            </Header>
            <ToDoFormWrapper>
                <form onSubmit={handleSubmit(AddToCategoryFn)}>
                    { isShowLabel ? <label htmlFor="aCtg">Add Category</label> : null }
                    <input id="aCtg" {...register("addCategory", {
                    required: "Please wirte Category"}
                    )} placeholder="Add to Category" />
                    <button>Add</button>
                    <span>{ errors?.addCategory?.message }</span>
                </form>
                <div>
                    { isShowLabel ? <label htmlFor="ctg">Category</label> : null }
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
                <p>{categoryText}</p>
                <ul>
                    {toDos?.map(toDo =><ToDo key={toDo.id} {...toDo}></ToDo>)}
                </ul>
            </ToDoBoxWrapper>

            <FixedBtnWrapper>
                <BtnTheme onClick={ToggleTheme} isDark={isDark}>
                    {isDark ? "Light" : "Dark"}
                </BtnTheme>
            </FixedBtnWrapper>
        </Container>
    );
}

export default ToDoList;