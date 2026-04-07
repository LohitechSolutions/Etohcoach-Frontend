import { IBlock } from "../../../framework/src/IBlock";
import { Message } from "../../../framework/src/Message";
import { BlockComponent } from "../../../framework/src/BlockComponent";
import MessageEnum, {
  getName
} from "../../../framework/src/Messages/MessageEnum";
import { runEngine } from "../../../framework/src/RunEngine";

// Customizable Area Start
// Customizable Area End

export const configJSON = require("./config");

export interface Props {
  navigation: any;
  id: string;

  // Customizable Area Start
  // Customizable Area End
}

interface S {
  // Customizable Area Start
  txtInputValue: string;
  txtSavedValue: string;
  enableField: boolean;
  outOfStock: boolean;
  pricerange: boolean;
  brand: boolean;
  category: boolean;
  tag: boolean;
  checkedStock: boolean;
  checkedDiscounted: boolean;
  checkedBrand: any;
  rangeLow: any;
  rangeHigh: any;
  value: any;
  token: string;
  data: any;
  checkedCategory: boolean;
  checkedTag: boolean;
  GetAllBrand: any;
  BrandList: any;
  selectedItems: any;
  selectedCategory:any;
  scrollEnabled:boolean;
  minValue:any;
  maxValue:any;
  priceMin:any;
  priceMax:any;
  price:any;
  arrayHolder:any;
  categoryArray:any;
  catHolder:any
  // Customizable Area End
}

interface SS {
  id: any;
}

export default class FilteroptionsController extends BlockComponent<
  Props,
  S,
  SS
> {
  // Customizable Area Start
  getProductApiCallId: any = "";
  getBrandApiCallId: any = "";
  applyAllApiCallId:any = "";
  // Customizable Area End
  constructor(props: Props) {
    super(props);
    this.receive = this.receive.bind(this);

    // Customizable Area Start
    this.subScribedMessages = [
      getName(MessageEnum.AccoutLoginSuccess),
      getName(MessageEnum.RestAPIResponceMessage),
      getName(MessageEnum.SessionSaveMessage),
      getName(MessageEnum.SessionResponseMessage)
    ];

    this.state = {
      txtInputValue: "",
      txtSavedValue: "A",
      enableField: false,
      outOfStock: false,
      pricerange: true,
      brand: false,
      category: false,
      tag: false,
      checkedStock: false,
      checkedDiscounted: false,
      rangeLow: "",
      rangeHigh: "",
      value: 10,
      token: "",
      data: [],
      checkedBrand: null,
      checkedCategory: false,
      checkedTag: false,
      GetAllBrand: [],
      BrandList:[],
      selectedItems: [],
      selectedCategory:[],
      scrollEnabled:false,
      minValue:10,
      maxValue:200,
      priceMin:0,
      priceMax:0,
      price:[],
      arrayHolder:[],
      categoryArray:[],
      catHolder:[]
    };

    // Customizable Area End
    runEngine.attachBuildingBlock(this as IBlock, this.subScribedMessages);
  }
  valueChange(value: any) {
    this.setState({ value: value });
  }
  openFilter(value: any) {
    if (value === "stock") {
      this.setState({
        tag: false,
        outOfStock: true,
        pricerange: false,
        brand: false,
        category: false
      });
    }
    if (value === "pricerange") {
      this.setState({
        tag: false,
        outOfStock: false,
        pricerange: true,
        brand: false,
        category: false
      });
    }
    if (value === "brand") {
      this.setState({
        tag: false,
        outOfStock: false,
        pricerange: false,
        brand: true,
        category: false
      });
    }
    if (value === "category") {
      this.setState({
        tag: false,
        outOfStock: false,
        pricerange: false,
        brand: false,
        category: true
      });
    }
    if (value === "tags") {
      this.setState({
        tag: true,
        outOfStock: false,
        pricerange: false,
        brand: false,
        category: false
      });
    }
  }

  async componentDidMount() {
    super.componentDidMount();
    this.getToken();
    if (this.isPlatformWeb() === false) {
      this.props.navigation.addListener("willFocus", () => {
        this.getToken();
      });
    }
    // Customizable Area Start
    if (!this.isPlatformWeb()) {
      let params = this.props.navigation.state.params ;
      const min = params && params.min ? params.min : 0 ;
      const max = params && params.max? params.max : 100 ;
      if(params.priceSelectedMin != undefined &&  params.priceSelectedMax != undefined){
        this.setState({
          minValue:params.priceSelectedMin,
          maxValue:params.priceSelectedMax
        })
      }else{
        this.setState({
          minValue:min,
          maxValue:max
        })
      }
    }
    // Customizable Area End
  }
  
  getToken = () => {
    const msg: Message = new Message(
      getName(MessageEnum.SessionRequestMessage)
    );
    this.send(msg);
  };
  getListRequest = (token: any) => {
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getProductApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.productAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiMethodTypeGet
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
  getBrandList = (token: any) => {
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.getBrandApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      configJSON.brandAPiEndPoint
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiMethodTypeGet
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
  };
 
  applyAllfilters=()=>{
    let url = configJSON.cataloguesAPiEndPoint;
    const priceMin = this.state.priceMin ;
    const priceMax = this.state.priceMax ;
    let brandSingle ="q[brand_id][]=" ;
    let brandMulti = "&q[brand_id][]=";
    let priceValue = 'q[price][from]='+ 
    `${priceMin}` + '&q[price][to]=' + `${priceMax}`;
    let categorySingle = "q[category_id][]=" ;
    let categoryMulti =  "&q[category_id][]=";
    let brands = [];
    let price = priceMin !== 0 && priceMax !== 0;
    if(this.state.selectedItems.length > 0){
      let selectedItems = this.state.selectedItems
      brands =  selectedItems
    }
    let Category = [];
    if(this.state.selectedCategory.length > 0){
      let selectedCategory = this.state.selectedCategory
      Category =  selectedCategory
    }
    if(brands && !Category.length && !price){
      console.log("brands && !Category.length && !price")
      for (let i = 0; i < brands.length; i++) {
        if (i === 0) {
          url = url + brandSingle + brands[i].id;
        } else {
          url = url + brandMulti + brands[i].id;
        }
      }
    }
    else if(price && !brands.length && !Category){
      console.log("price && !brands.length && !Category")
      url = url + priceValue
    }
    else if(Category && !brands.length &&!price){
      console.log("Category && !brands.length &&!price")
      for (let i = 0; i < Category.length; i++) {
        if (i === 0) {
          url = url + categorySingle + Category[i].id;
        } else {
          url = url + categoryMulti + Category[i].id;
        }
      }
    }else if(brands && price && !Category.length){
      console.log("brands && price && !Category.length")
      let i = 0;
      let brandSelect = '';
      for (i = 0 ; i < brands.length; i++) {
        if (brands.length === 1) {
          console.log("single brandSelect final url")
          brandSelect = brandSingle + brands[i].id ;
         } else{
          console.log("Multi brandSelect final url")
          brandSelect = brandMulti + brands[i].id
         }
        url = url + brandSelect 
      }
      url = url + "&" + priceValue
    }
    else if(Category && price && !brands.length){
      console.log("Category && price && !brands.length")
      let j = 0;
      let catSelect = '';
      for (j = 0 ; j < Category.length; j++) {
          console.log(Category , "final url")
          if (Category.length === 1) {
            console.log("single catSelect final url")
            catSelect = categorySingle + Category[j].id ;
          } else{
            console.log("Multi catSelect final url")
            catSelect = categoryMulti + Category[j].id
          }
        url = url + catSelect 
      }
      url = url + "&" + priceValue
    }
    else if(Category && brands && !price){
      console.log("Category && brands && !price")
      let i = 0;
      let j = 0;
      let brandSelect = '';
      let catSelect = '';
      for (i = 0 ; i < brands.length; i++) {
        if (brands.length === 1) {
          console.log("single brandSelect final url")
          brandSelect = brandSingle + brands[i].id ;
         } else{
          console.log("Multi brandSelect final url")
          brandSelect = brandMulti + brands[i].id
         }
        url = url + brandSelect 
      }
      for (j = 0 ; j < Category.length; j++) {
          console.log(Category , "final url")
          if (Category.length === 1) {
            console.log("single catSelect final url")
            catSelect = categorySingle + Category[j].id ;
          } else{
            console.log("Multi catSelect final url")
            catSelect = categoryMulti + Category[j].id
          }
        url = url + catSelect 
      }
    }else if(Category && brands && price){
      console.log("Category && brands && price final url")
      let i = 0;
      let j = 0;
      let brandSelect = '';
      let catSelect = '';
      for (i = 0 ; i < brands.length; i++) {
        if (brands.length === 1) {
          console.log("single brandSelect final url")
          brandSelect = brandSingle + brands[i].id + "&";
         } else{
          console.log("Multi brandSelect final url")
          brandSelect = brandMulti + brands[i].id
         }
        url = url + brandSelect 
      }
      for (j = 0 ; j < Category.length; j++) {
          console.log(Category , "final url")
          if (Category.length === 1) {
            console.log("single catSelect final url")
            catSelect = categorySingle + Category[j].id ;
          } else{
            console.log("Multi catSelect final url")
            catSelect = categoryMulti + Category[j].id
          }
        url = url + catSelect 
      }
      url = url + "&" + priceValue
    }
    else{
      this.props.navigation.goBack();
    }
    const header = {
      "Content-Type": configJSON.productApiContentType,
      token: this.state.token
    };
    const requestMessage = new Message(
      getName(MessageEnum.RestAPIRequestMessage)
    );
    this.applyAllApiCallId = requestMessage.messageId;
    requestMessage.addData(
      getName(MessageEnum.RestAPIResponceEndPointMessage),
      url
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestHeaderMessage),
      JSON.stringify(header)
    );
    requestMessage.addData(
      getName(MessageEnum.RestAPIRequestMethodMessage),
      configJSON.apiMethodTypeGet
    );
    runEngine.sendMessage(requestMessage.id, requestMessage);
    console.log(url,"final url")
  }
  async receive(from: string, message: Message) {
    // Customizable Area Start
   
    if (getName(MessageEnum.SessionResponseMessage) === message.id) {
      let token = message.getData(getName(MessageEnum.SessionResponseToken));
      this.setState({ token: token });
      this.getListRequest(token);
      this.getBrandList(token);
    }
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.applyAllApiCallId != null &&
      this.applyAllApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (responseJson && !responseJson.errors && responseJson.data) {
        this.setState({
          data: responseJson.data
        });
        if(this.state.data.length > 0){
          this.props.navigation.push("Filteritems", { data: this.state.data});
        }else{
          this.showAlert("Error", "Data not found!!!")
        }
      } else {
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );
        this.parseApiCatchErrorResponse(errorReponse);
      }
    }
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.getBrandApiCallId != null &&
      this.getBrandApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (responseJson && !responseJson.errors && responseJson.data) {
        this.setState({
          GetAllBrand: responseJson.data,
          BrandList:responseJson.data
        });
      } else {
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );
        this.parseApiCatchErrorResponse(errorReponse);
      }
    }
    if (
      getName(MessageEnum.RestAPIResponceMessage) === message.id &&
      this.getProductApiCallId != null &&
      this.getProductApiCallId ===
        message.getData(getName(MessageEnum.RestAPIResponceDataMessage))
    ) {
      var responseJson = message.getData(
        getName(MessageEnum.RestAPIResponceSuccessMessage)
      );

      if (responseJson && !responseJson.errors && responseJson.data) {
        this.setState({
          arrayHolder: responseJson.data,
          categoryArray:responseJson.data
        });
      } else {
        var errorReponse = message.getData(
          getName(MessageEnum.RestAPIResponceErrorMessage)
        );
        this.parseApiCatchErrorResponse(errorReponse);
      }
    }
    // Customizable Area End
  }

  // Customizable Area Start
  // Customizable Area End
}
