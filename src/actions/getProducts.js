import image1 from '../Images/Product/image1.png';
import image2 from '../Images/Product/image2.png';
import image3 from '../Images/Product/image3.png';
import image4 from '../Images/Product/image4.png';


export default function getProducts() {
    try {
        const data = [
            {   
                id: 1,
                title: "Syltherine",
                desc: "Stylish cafe chair",
                type: "Chair",
                price: "2,500.000",
                oldprice: "3,500.000",
                time: "New",
                image: image1,
            },{   
                id: 2,
                title: "Lolito",
                desc: "Luxury big sofa",
                type: "Sofa",
                price: "7,000.000",
                oldprice: "14,000.000",
                time: "New",
                image: image2,
            },{   
                id: 3,
                title: "Respira",
                desc: "Outdoor table and stool",
                type: "Table",
                price: "500.000",
                oldprice: "1,500.000",
                time: "New",
                image: image3,
            },{   
                id: 4,
                title: "Grifo",
                desc: "Night lamp",
                type: "Lamp",
                price: "1,500.000",
                oldprice: "2,000.000",
                time: "30%",
                image: image4,
            },{   
                id: 1,
                title: "Syltherine",
                desc: "Stylish cafe chair",
                type: "Chair",
                price: "2,500.000",
                oldprice: "3,500.000",
                time: "New",
                image: image1,
            },{   
                id: 2,
                title: "Lolito",
                desc: "Luxury big sofa",
                type: "Sofa",
                price: "7,000.000",
                oldprice: "14,000.000",
                time: "New",
                image: image2,
            },{   
                id: 3,
                title: "Respira",
                desc: "Outdoor table and stool",
                type: "Table",
                price: "500.000",
                oldprice: "1,500.000",
                time: "New",
                image: image3,
            },{   
                id: 4,
                title: "Grifo",
                desc: "Night lamp",
                type: "Lamp",
                price: "1,500.000",
                oldprice: "2,000.000",
                time: "50%",
                image: image4,
            },
        ];
        return data;
    } catch (error) {
        return error;
    }
}
