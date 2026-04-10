import { useNavigate } from "react-router-dom";
import "./Categories.css";
import AppetizerImg from "../../assets/Appetizer.jpg"
import MainImg from "../../assets/Main.jpg"
import SideImg from "../../assets/Side.jpg"
const Categories = () => {
  const navigate = useNavigate();

  const categories = [
    { name: "Appetizer", route: "/foodcategories/Appetizer", image: AppetizerImg },
    { name: "Main", route: "/foodcategories/Main", image: MainImg },
    { name: "Side", route: "/foodcategories/Side", image: SideImg}
  ];

  return (
    
        <div className="categories-page">
      <h1 className="title">Explore Our Categories</h1>

      <div className="categories-grid">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="category-card"
            style={{ backgroundImage: `url(${cat.image})` }}
            onClick={() => navigate(cat.route)}
          >
            <div className="overlay"></div>
            <h2>{cat.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Categories