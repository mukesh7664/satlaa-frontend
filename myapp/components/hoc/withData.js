// hoc/withData.js
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getTags_r } from "@/redux/actions/Tags";
import { getSubcategory_r } from "@/redux/actions/SubCategory";
import { getColors_r } from "@/redux/actions/Colors";
import { getBadges_r } from "@/redux/actions/Badges";
import { getStyles_r } from "@/redux/actions/Styles.js";
import { getCategories_r } from "@/redux/actions/Categories";
import { getTopmenu_r } from "@/redux/actions/Topmenu";
import { settings_r } from "@/redux/actions/Setting";
const withData = (WrappedComponent) => {
    const WithData = (props) => {
        const dispatch = useDispatch();

        useEffect(() => {
            const fetchData = async () => {
                await dispatch(getTags_r());
                await dispatch(settings_r());
                await dispatch(getCategories_r());
                await dispatch(getColors_r());
                await dispatch(getBadges_r());
                await dispatch(getStyles_r());
                await dispatch(getSubcategory_r());
                await dispatch(getTopmenu_r());
            };

            fetchData();
        }, [dispatch]);

        return <WrappedComponent {...props} />;
    };

    WithData.displayName = `WithData(${getDisplayName(WrappedComponent)})`;

    return WithData;
};

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withData;
