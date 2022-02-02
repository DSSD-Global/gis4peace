# JSON Configuration File Documentation

This document describes the properties of the `config.json` file, and how to use it to configure the app to your desired implementation.

## Properties

### 1. `title`

This property is used to fill the application title used in the window/tab bar.

### 2. `source`

This property is used to refer to the feature service that will be used as the source for the data

>https://services7.arcgis.com/sampleid/ArcGIS/rest/services/sampleservice/FeatureServer/0

### 3. `filterValuesSource`

This property is nullable. If it is not null, it references a specific feature by its `objectid` to fill the potential values of the `userFilters` property below. It overrides any specific values applied directly in `userFilters`. In this case, all values would have their `selectable` property set to true. The label would be the same as the value with underscores replaced for spaces, and set in Title Case.

>32

### 4. `userFilters`

This property is an array of the filters that a user can apply to the gallery items to narrow down their results. The array could be empty, implying that no attribute data should be used for the filtration of results. If the array is empty, no filters show in the application and the ability to toggle away attribute filters in and out of view is removed.

Making multiple selections *within* the same filter is an `OR` operation. Making selections *across* different filters is an `AND` operation.

The elements of the array are described below.

#### 4.1. `name`
The name of the field that should be used

#### 4.2. `label`
The label of the filter displayed to the user

#### 4.3. `separator`
In order to support having multiple values in the same field, the values contained within each row could be separated. In this case, you need to define the separator used (eg. `","`). If the field would only contain one value, `null` should be used as the separator.

#### 4.4. `values`
This property is used in case you want to directly configure what values should be used for the filter. It is important to note that the root property `filterValuesSource` overrides these explicitly stated values.

If `filterValuesSource` is not set, the app will use the explicitly defined values in the config file. If there are no explicitly defined values, the app will determine the unique values contained within the field and use them. To determine the unique values, the app uses the existing features *after* the filtration done by `appliedFilters`.

`values` is an array of JSON Objects described below.

##### 4.4.1. `value`
The actual value applied in the field. This could be null for values where `selectable` is set to `false`

##### 4.4.2. `label`
The user-friendly label to be used for that value

##### 4.4.3. `selectable`
Determines if that value should be used as an actual filtration value that is selectable via checkbox or just displayed as a regular label.

### 5. `appliedFilters`
This property is used to "pre-filter" the features in the `source` Feature Service to a specific set before any user filters could be applied.

It is an array of JSON Objects structured as described below.

#### 5.1. `field`
The name of the field to be used to pre-filter the features.

#### 5.2. `values`
An array of values to be used as filters for those fields. Only features that have these values in that field will be used in the app at all.

### 6. `item`
This property is used to map the application items to the feature attribute data as a JSON object described below.

#### 6.1. `name`
The field to be used to fill the card's name

#### 6.2. `url`
The field to be used to fill the card's URL

#### 6.3. `description`
The field to be used to fill the card's description

#### 6.4. `thumbnail`
This property is used to determine how to display the thumbnail in the card, described below.

##### 6.4.1. `display`
Whether or not a thumbnail should be displayed in the card

##### 6.4.2. `type`
Determines if the thubmnail should be populated from the feature attachment. In that case, the value would be `attachment`. If the thumbnail should be populated from a field containing the url, then the value would be `field`.

##### 6.4.3. `field`
Determines the field that should be used to populate the thumbnail if `type` is set to `field`.

### 7. `map`
JSON Object determining how the map should be displayed, described below. Location filtration is `AND`ed with selected attribute filters. Only one location can be selected at a time.

#### 7.1. `display`
Determines whether or not a map is displayed for location filtration at all.

#### 7.2. `basemap`
Determines the basemap to be used within the map.

#### 7.3. `center`
Determines the center of the map to be shown.

#### 7.4. `zoom`
Determines the zoom level of the map to be shown.

#### 7.5. `showZoomButtons`
Determines whether to show or hide the zoom buttons on the map.

#### 7.6. `locationSymbol`
The symbol to be used to display the features. This can be filled from the [JS API Sample Playground](https://developers.arcgis.com/javascript/latest/sample-code/playground/live/#/config=symbols/2d/SimpleMarkerSymbol.json).

#### 7.7. `selectedLocationSymbol`
The symbol to be used to display the selected location. This can be filled from the [JS API Sample Playground](https://developers.arcgis.com/javascript/latest/sample-code/playground/live/#/config=symbols/2d/SimpleMarkerSymbol.json).

### 8. `descMax`
The maximum length of the description including the ellipsis. The maximum length will not cut off a word, but will find the nearest space to the length to add the ellipsis.

### 9. `itemsPerRow`
The number of cards to display per row on a mid-size to large screen.

### 10. `mobileItemsPerRow`
The number of cards to display per row on a small screen.

### 11. `darkMode`
Determines whether the app should be displayed in dark mode.