import React from "react";
import { Dimensions, FlatList, View } from "react-native";

const { width } = Dimensions.get("window");

export default class AppIntroSlider extends React.Component {
  constructor(props) {
    super(props);
    this.flatListRef = null;
  }

  goToSlide = (index, animated = true) => {
    if (!this.flatListRef || typeof index !== "number") {
      return;
    }
    this.flatListRef.scrollToIndex({ index, animated });
  };

  renderItem = ({ item, index }) => {
    const { renderItem } = this.props;
    if (!renderItem) {
      return <View style={{ width }} />;
    }
    return <View style={{ width }}>{renderItem({ item, index })}</View>;
  };

  keyExtractor = (item, index) => {
    const { keyExtractor } = this.props;
    if (keyExtractor) {
      return String(keyExtractor(item, index));
    }
    return String(item?.key ?? index);
  };

  render() {
    const { data = [] } = this.props;

    return (
      <FlatList
        ref={(ref) => {
          this.flatListRef = ref;
        }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={this.renderItem}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}
