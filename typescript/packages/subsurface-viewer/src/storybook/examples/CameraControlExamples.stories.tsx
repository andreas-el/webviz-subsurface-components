import React from "react";
import type { Meta, StoryObj } from "@storybook/react";

import { SimpleMeshLayer } from "@deck.gl/mesh-layers/typed";
import { SphereGeometry } from "@luma.gl/engine";

import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";

import SubsurfaceViewer from "../../SubsurfaceViewer";
import type { SubsurfaceViewerProps } from "../../SubsurfaceViewer";
import type { ViewStateType, BoundingBox3D } from "../../components/Map";
import { AxesLayer } from "../../layers";

import {
    mainStyle as defaultmainStyle,
    huginAxes3DLayer,
    default3DViews,
    hugin3DBounds,
    huginMapDepthPropLayerPng,
    huginMapNetmapPropLayerPng,
    huginMeshMapLayerPng,
    northArrowLayer,
    volveWellsBounds,
    volveWellsLayer,
    volveWellsWithLogsLayer,
} from "../sharedSettings";

const stories: Meta = {
    component: SubsurfaceViewer,
    title: "SubsurfaceViewer/Examples/Camera",
    args: {
        // Add a reset button for all the stories.
        // Somehow, I do not manage to add the triggerHome to the general "unset" controls :/
        triggerHome: 0,
    },
};
export default stories;

const defaultStoryParameters = {
    docs: {
        inlineStories: false,
        iframeHeight: 500,
    },
};

const classes = {
    main: "default-main",
    mainWithButton: "mian-with-button",
};

const Root = styled("div")({
    ...defaultmainStyle,
    [`& .${classes.mainWithButton}`]: {
        height: 500,
        border: "1px solid black",
        background: "azure",
        position: "relative",
    },
});

const DisplayCameraPositionComponent: React.FC<SubsurfaceViewerProps> = (
    args
) => {
    const [cameraState, setCameraState] = React.useState(args.cameraPosition);

    const getCameraPosition = React.useCallback((input: ViewStateType) => {
        setCameraState(input);
    }, []);
    return (
        <>
            <SubsurfaceViewer
                {...args}
                cameraPosition={args.cameraPosition}
                getCameraPosition={getCameraPosition}
            />
            <div
                style={{
                    position: "absolute",
                    marginLeft: 200,
                }}
            >
                <div>zoom: {cameraState?.zoom}</div>
                <div>rotationX: {cameraState?.rotationX}</div>
                <div>rotationOrbit: {cameraState?.rotationOrbit}</div>
                <div>targetX: {cameraState?.target[0]}</div>
                <div>targetY: {cameraState?.target[1]}</div>
            </div>
        </>
    );
};

const cameraPosition: ViewStateType = {
    target: [435800, 6478000],
    zoom: -3.5,
    rotationX: 90,
    rotationOrbit: 0,
};

export const DisplayCameraState: StoryObj<typeof SubsurfaceViewer> = {
    args: {
        id: "volve-wells",
        bounds: volveWellsBounds,
        layers: [volveWellsLayer],
        cameraPosition,
    },
    render: (args) => <DisplayCameraPositionComponent {...args} />,
};

const SyncedMultiViewComponent = (args: {
    show3d: boolean;
    sync: string[];
}) => {
    const subsurfaceViewerArgs: SubsurfaceViewerProps = {
        id: "view_state_synchronization",
        layers: [
            huginMapNetmapPropLayerPng,
            huginMapDepthPropLayerPng,
            volveWellsLayer,
        ],
        views: {
            layout: [2, 2] as [number, number],
            viewports: [
                {
                    id: "view_1",
                    layerIds: [huginMapDepthPropLayerPng.id],
                    show3D: args.show3d,
                    isSync: args.sync.includes("view_1"),
                },
                {
                    id: "view_2",
                    layerIds: [huginMapNetmapPropLayerPng.id],
                    show3D: args.show3d,
                    isSync: args.sync.includes("view_2"),
                },
                {
                    id: "view_3",
                    layerIds: [volveWellsLayer.id],
                    show3D: args.show3d,
                    isSync: args.sync.includes("view_3"),
                },
                {
                    id: "view_4",
                    layerIds: [
                        volveWellsLayer.id,
                        huginMapDepthPropLayerPng.id,
                    ],
                    show3D: args.show3d,
                    isSync: args.sync.includes("view_4"),
                },
            ],
        },
    };
    return <SubsurfaceViewer {...subsurfaceViewerArgs} />;
};

export const SyncedMultiView: StoryObj<typeof SyncedMultiViewComponent> = {
    args: {
        show3d: false,
        sync: ["view_1", "view_2", "view_3", "view_4"],
    },

    argTypes: {
        sync: {
            options: ["view_1", "view_2", "view_3", "view_4"],
            control: "check",
        },
    },
    render: (args) => <SyncedMultiViewComponent {...args} />,
};

const SyncedCameraSettingsComponent = (args: SubsurfaceViewerProps) => {
    const [cameraPosition, setCameraPosition] = React.useState(
        args.cameraPosition
    );

    React.useEffect(() => {
        if (args.cameraPosition) {
            setCameraPosition({ ...args.cameraPosition });
        }
    }, [args.cameraPosition]);

    const props = {
        ...args,
        cameraPosition,
        getCameraPosition: setCameraPosition,
    };

    return (
        <div
            style={{
                height: "96vh",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
            }}
        >
            <div
                style={{
                    position: "relative",
                }}
            >
                <SubsurfaceViewer {...props} />
            </div>
            <div
                style={{
                    position: "relative",
                }}
            >
                <SubsurfaceViewer {...props} />
            </div>
        </div>
    );
};

export const SyncedSubsurfaceViewer: StoryObj<typeof SubsurfaceViewer> = {
    args: {
        id: "volve-wells",
        bounds: volveWellsBounds,
        layers: [volveWellsLayer],
        cameraPosition,
    },
    render: (args) => <SyncedCameraSettingsComponent {...args} />,
};

const zoomBox3D: BoundingBox3D = [-325, -450, -25, 125, 150, 125];
//const zoomBox3D: BoundingBox3D = [-100, -100, -100,  100, 100, 100];

const AutoZoomToBox = (args: SubsurfaceViewerProps) => {
    const [rotX, setRotX] = React.useState(0);
    const [rotZ, setRotZ] = React.useState(0);

    const cameraPosition: ViewStateType = {
        rotationX: rotX,
        rotationOrbit: rotZ,
        zoom: zoomBox3D,
        target: [0, 0, 0],
    };

    const props = {
        ...args,
        cameraPosition,
    };

    return (
        <Root>
            <div className={classes.mainWithButton}>
                <SubsurfaceViewer {...props} />
            </div>
            <Box flexDirection={"column"}>
                <label>{"Rotation X Axis "}</label>
                <Slider
                    defaultValue={50}
                    valueLabelDisplay={"auto"}
                    onChange={(_event: Event, value: number | number[]) => {
                        const angle = 2 * ((value as number) / 100 - 0.5) * 90;
                        setRotX(angle);
                    }}
                />
            </Box>
            <Box flexDirection={"column"}>
                <label>{"Rotation Z Axis "}</label>
                <Slider
                    defaultValue={50}
                    valueLabelDisplay={"auto"}
                    onChange={(_event: Event, value: number | number[]) => {
                        const angle = 2 * ((value as number) / 100 - 0.5) * 180;
                        setRotZ(angle);
                    }}
                />
            </Box>
        </Root>
    );
};

export const AutoZoomToBoxStory: StoryObj<typeof SubsurfaceViewer> = {
    args: {
        id: "DeckGL-Map",
        layers: [
            new AxesLayer({
                id: "polyhedral-cells-axes",
                bounds: zoomBox3D,
                ZIncreasingDownwards: false,
            }),
            // unfortunately, SimpleMeshLayer can not be specified as a Record<string, any> :(
            new SimpleMeshLayer({
                id: "sphere",
                data: [{}],
                mesh: new SphereGeometry({
                    nlat: 100,
                    nlong: 100,
                    radius: 30,
                }),
                wireframe: false,
                getPosition: [0, 0, 0],
                getColor: [255, 255, 255],
                material: true,
            }),
        ],
        views: default3DViews,
    },
    parameters: {
        docs: {
            inlineStories: false,
            iframeHeight: 500,
            description: {
                story: "",
            },
        },
    },
    render: (args) => <AutoZoomToBox {...args} />,
};

const ScaleZComponent: React.FC<SubsurfaceViewerProps> = (args) => {
    const [layers, setLayers] = React.useState([
        huginAxes3DLayer,
        huginMeshMapLayerPng,
        northArrowLayer,
    ]);

    const handleChange = () => {
        setLayers([
            huginAxes3DLayer,
            huginMeshMapLayerPng,
            volveWellsWithLogsLayer,
            northArrowLayer,
        ]);
    };

    const props = {
        ...args,
        layers,
    };

    return (
        <Root>
            <div className={classes.mainWithButton}>
                <SubsurfaceViewer {...props} />
            </div>
            <button onClick={handleChange}>Add layer</button>
        </Root>
    );
};

export const ScaleZ: StoryObj<typeof SubsurfaceViewer> = {
    args: {
        id: "ScaleZ",
        layers: [
            huginAxes3DLayer,
            huginMeshMapLayerPng,
            volveWellsWithLogsLayer,
            northArrowLayer,
        ],
        bounds: volveWellsBounds,

        views: {
            layout: [1, 2],
            viewports: [
                {
                    id: "view_1",
                    layerIds: [
                        huginAxes3DLayer.id,
                        huginMeshMapLayerPng.id,
                        northArrowLayer.id,
                    ],
                    show3D: true,
                    isSync: true,
                },
                {
                    id: "view_2",
                    layerIds: [
                        huginAxes3DLayer.id,
                        volveWellsWithLogsLayer.id,
                        northArrowLayer.id,
                    ],
                    show3D: true,
                    isSync: true,
                },
            ],
        },
    },
    parameters: {
        docs: {
            ...defaultStoryParameters.docs,
            description: {
                story: "Example scaling in z direction using arrow up/down buttons.",
            },
        },
    },
    render: (args) => <ScaleZComponent {...args} />,
};

const ResetCameraPropertyDefaultCameraPosition = {
    rotationOrbit: 0,
    rotationX: 45,
    target: [435775, 6478650, -2750],
    zoom: -3.8,
};

const ResetCameraComponent: React.FC<SubsurfaceViewerProps> = (args) => {
    const [camera, setCamera] = React.useState(
        () => args.cameraPosition ?? ResetCameraPropertyDefaultCameraPosition
    );

    const handleChange = () => {
        setCamera({
            ...camera,
            rotationOrbit: camera.rotationOrbit + 5,
        });
    };

    const props = {
        ...args,
        cameraPosition: camera,
    };

    return (
        <Root>
            <div className={classes.mainWithButton}>
                <SubsurfaceViewer {...props} />
            </div>
            <button onClick={handleChange}> Change Camera </button>
        </Root>
    );
};

export const ResetCameraStory: StoryObj<typeof SubsurfaceViewer> = {
    args: {
        id: "ResetCameraProperty",
        layers: [huginAxes3DLayer, huginMeshMapLayerPng, northArrowLayer],

        bounds: volveWellsBounds,
        cameraPosition: ResetCameraPropertyDefaultCameraPosition,
        views: default3DViews,
    },
    parameters: {
        docs: {
            ...defaultStoryParameters.docs,
            description: {
                story: `Pressing the button 'Change Camera' does rotate it.`,
            },
        },
    },
    render: (args) => <ResetCameraComponent {...args} />,
};

const AddLayerComponent: React.FC<SubsurfaceViewerProps> = (args) => {
    const [layers, setLayers] = React.useState([
        huginAxes3DLayer,
        huginMeshMapLayerPng,
        northArrowLayer,
    ]);

    const handleChange = () => {
        setLayers([
            huginMeshMapLayerPng,
            huginAxes3DLayer,
            volveWellsWithLogsLayer,
            northArrowLayer,
        ]);
    };

    const props = {
        ...args,
        layers,
    };

    return (
        <Root>
            <div className={classes.mainWithButton}>
                <SubsurfaceViewer {...props} />
            </div>
            <button onClick={handleChange}> Add layer </button>
        </Root>
    );
};

export const AddLayer: StoryObj<typeof SubsurfaceViewer> = {
    args: {
        id: "map",
        //bounds: volveWellsBounds,  // Keep this line for future testing.
        cameraPosition: {
            rotationOrbit: 45,
            rotationX: 45,
            zoom: hugin3DBounds,
            target: [0, 0, 0],
        },
        views: default3DViews,
    },
    parameters: {
        docs: {
            ...defaultStoryParameters.docs,
            description: {
                story: `Example using button to add a layer.`,
            },
        },
    },
    render: (args) => <AddLayerComponent {...args} />,
};