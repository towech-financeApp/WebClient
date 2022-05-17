import * as React from 'react';
import { SVGProps } from 'react';

interface iconIdProps extends SVGProps<SVGSVGElement> {
  iconid: number;
}

const IdIcons = (props: iconIdProps): JSX.Element => {
  switch (props.iconid) {
    case -2:
      return Icon_2(props);
    case 0:
      return Icon0(props);
    case 1:
      return Icon1(props);
    case 2:
      return Icon2(props);
    case 3:
      return Icon3(props);
    case 4:
      return Icon4(props);
    case 5:
      return Icon5(props);
    case 6:
      return Icon6(props);
    case 7:
      return Icon7(props);
    case 8:
      return Icon8(props);
    default:
      return defaultIcon(props);
  }
};

const defaultIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <defs>
      <style>{'.Recurso_1_svg__cls-2{fill:#ab0036}'}</style>
    </defs>
    <g id="Recurso_1_svg__Capa_2" data-name="Capa 2">
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#c4c4c4',
        }}
        id="Recurso_1_svg__Capa_1-2"
        data-name="Capa 1"
      />
      <g id="Recurso_1_svg__Capa_2-2" data-name="Capa 2">
        <path
          className="Recurso_1_svg__cls-2"
          d="M72 29.57c-.64-10.32-10-20-20.31-21a22.5 22.5 0 0 0-24 17.2 1.39 1.39 0 0 0 1.52 1.69l1.81-.21a2.27 2.27 0 0 0 1.89-1.56A17.49 17.49 0 1 1 52 48.3a2.48 2.48 0 0 0-2.47 2.47V76h5V54a1.43 1.43 0 0 1 1.06-1.37A22.49 22.49 0 0 0 72 29.57Z"
        />
        <circle className="Recurso_1_svg__cls-2" cx={52} cy={86} r={4.5} />
      </g>
    </g>
  </svg>
);

const Icon_2 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <circle
      cx={50}
      cy={50}
      r={50}
      style={{
        fill: '#22398e',
      }}
    />
    <path
      style={{
        fill: '#a67c52',
      }}
      d="M50 81.66 20 64.34v-30l30 17.32v30z"
    />
    <path
      style={{
        fill: '#fab700',
      }}
      d="M50 70.66 20 53.34v-7l30 17.32v7z"
    />
    <path
      style={{
        fill: '#8c6239',
      }}
      d="m50 81.66 30-17.32v-30L50 51.66v30z"
    />
    <path
      style={{
        fill: '#d28f00',
      }}
      d="m50 70.66 30-17.32v-7L50 63.66v7z"
    />
    <path
      style={{
        fill: '#b0865a',
      }}
      d="M80 34.34 50 51.66 20 34.34l30-17.32 30 17.32z"
    />
    <path
      style={{
        fill: '#81ccdf',
      }}
      d="M66.76 26.7 36.77 44.02l-3.53-2.04 29.99-17.32 3.53 2.04z"
    />
  </svg>
);

const Icon0 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <circle
      cx={50}
      cy={50}
      r={50}
      style={{
        fill: 'none',
      }}
    />
    <path
      d="M97.5 50c0 26.23-21.27 47.5-47.5 47.5-63.01-2.5-62.99-92.51 0-95 26.23 0 47.5 21.27 47.5 47.5Z"
      style={{
        stroke: '#fff',
        strokeDasharray: '0 0 12.43 12.43',
        strokeMiterlimit: 10,
        strokeWidth: 5,
        fill: 'none',
      }}
    />
  </svg>
);

const Icon1 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <defs>
      <style>{'.Recurso_4_svg__e{fill:#ab0036}'}</style>
    </defs>
    <g id="Recurso_4_svg__b">
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#3b7c77',
        }}
        id="Recurso_4_svg__c"
      />
      <g id="Recurso_4_svg__d">
        <path className="Recurso_4_svg__e" d="m46.85 23.72-4.6 7h15.5l-4.6-7h-6.3z" />
        <path
          className="Recurso_4_svg__e"
          d="M72.44 18.71c-1.31-2.99-7.26-3.27-13.29-.62-6.02 2.65-9.84 7.22-8.53 10.21 1.31 2.99 7.26 3.27 13.29.62 6.02-2.65 9.84-7.22 8.53-10.21Zm-8.64 9.65c-4.72 2.15-9.49 1.99-10.66-.34s1.71-5.97 6.43-8.11 9.49-1.99 10.66.34-1.71 5.97-6.43 8.11Z"
        />
        <path
          className="Recurso_4_svg__e"
          d="M36.15 28.93c6.02 2.65 11.97 2.37 13.29-.62 1.31-2.99-2.5-7.56-8.53-10.21-6.02-2.65-11.97-2.37-13.29.62-1.31 2.99 2.5 7.56 8.53 10.21Zm-6.32-8.67c1.17-2.33 5.94-2.49 10.66-.34s7.6 5.78 6.43 8.11c-1.17 2.33-5.94 2.49-10.66.34-4.72-2.15-7.6-5.78-6.43-8.11Z"
        />
        <rect
          x={25}
          y={29.72}
          width={50}
          height={50}
          rx={3}
          ry={3}
          style={{
            fill: '#dbc583',
          }}
        />
        <path className="Recurso_4_svg__e" d="M75 47.22H57.5v-17.5h-15v17.5H25v15h17.5v17.5h15v-17.5H75v-15Z" />
      </g>
    </g>
  </svg>
);

const Icon2 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <defs>
      <style>{'.Recurso_7_svg__e{fill:#fff}.Recurso_7_svg__h{fill:#18bc65}.Recurso_7_svg__i{fill:#00ab36}'}</style>
    </defs>
    <g id="Recurso_7_svg__b">
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#3b7c77',
        }}
        id="Recurso_7_svg__c"
      />
      <g id="Recurso_7_svg__d">
        <path
          className="Recurso_7_svg__e"
          d="M38.66 19.85 16.5 43h67L61.34 19.85A6.013 6.013 0 0 0 57 18H42.98c-1.63 0-3.2.67-4.33 1.85Z"
        />
        <path
          style={{
            stroke: '#000',
            strokeMiterlimit: 10,
            strokeWidth: '.1px',
            fill: '#fff',
          }}
          d="m66.75 60.45 16.75-17.5h-67l16.75 17.5h33.5z"
        />
        <path
          className="Recurso_7_svg__i"
          d="M18.23 41.41h42.14c.83 0 1.5.67 1.5 1.5v18.78c0 .83-.67 1.5-1.5 1.5h-41.8c-.83 0-1.5-.67-1.5-1.5V42.58c0-.64.52-1.17 1.17-1.17Z"
          transform="rotate(-50 39.464 52.29)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={39.47}
          cy={52.3}
          rx={12.32}
          ry={6.53}
          transform="rotate(-50 39.464 52.29)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={45.75}
          cy={31.25}
          rx={1.12}
          ry={1.09}
          transform="rotate(-50 45.749 31.254)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={59.1}
          cy={42.45}
          rx={1.12}
          ry={1.09}
          transform="rotate(-50 59.102 42.454)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={33.18}
          cy={73.34}
          rx={1.12}
          ry={1.09}
          transform="rotate(-50 33.185 73.343)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={19.83}
          cy={62.14}
          rx={1.12}
          ry={1.09}
          transform="rotate(-50 19.832 62.143)"
        />
        <path
          className="Recurso_7_svg__i"
          d="M28.23 43.42h42.14c.83 0 1.5.67 1.5 1.5V63.7c0 .83-.67 1.5-1.5 1.5h-41.8c-.83 0-1.5-.67-1.5-1.5V44.59c0-.64.52-1.17 1.17-1.17Z"
          transform="rotate(-40 49.461 54.313)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={49.47}
          cy={54.31}
          rx={12.32}
          ry={6.53}
          transform="rotate(-40 49.461 54.313)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={59.31}
          cy={34.67}
          rx={1.12}
          ry={1.09}
          transform="rotate(-40 59.317 34.673)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={70.51}
          cy={48.02}
          rx={1.12}
          ry={1.09}
          transform="rotate(-40 70.514 48.02)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={39.62}
          cy={73.94}
          rx={1.12}
          ry={1.09}
          transform="rotate(-40 39.625 73.944)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={28.42}
          cy={60.59}
          rx={1.12}
          ry={1.09}
          transform="rotate(-40 28.428 60.597)"
        />
        <path
          className="Recurso_7_svg__i"
          d="M36.23 46.61h42.14c.83 0 1.5.67 1.5 1.5v18.78c0 .83-.67 1.5-1.5 1.5H36.56c-.83 0-1.5-.67-1.5-1.5V47.78c0-.64.52-1.17 1.17-1.17Z"
          transform="rotate(-30 57.473 57.5)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={57.47}
          cy={57.5}
          rx={12.32}
          ry={6.53}
          transform="rotate(-30 57.473 57.5)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={70.57}
          cy={39.87}
          rx={1.12}
          ry={1.09}
          transform="rotate(-30 70.577 39.87)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={79.28}
          cy={54.96}
          rx={1.12}
          ry={1.09}
          transform="rotate(-30 79.292 54.966)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={44.36}
          cy={75.13}
          rx={1.12}
          ry={1.09}
          transform="rotate(-30 44.37 75.129)"
        />
        <ellipse
          className="Recurso_7_svg__h"
          cx={35.65}
          cy={60.04}
          rx={1.12}
          ry={1.09}
          transform="rotate(-30 35.654 60.033)"
        />
        <path className="Recurso_7_svg__e" d="M66.75 60.5h-33.5L16.5 43v35h67V43L66.75 60.5z" />
        <path
          style={{
            fill: 'none',
            stroke: '#000',
            strokeMiterlimit: 10,
            strokeWidth: '.1px',
          }}
          d="M33.25 60.5 16.5 78h67L66.75 60.5h-33.5z"
        />
      </g>
    </g>
  </svg>
);

const Icon3 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <circle
      cx={50}
      cy={50}
      r={50}
      style={{
        fill: '#22398e',
      }}
    />
    <path
      style={{
        fill: '#a67c52',
      }}
      d="M50 81.66 20 64.34v-30l30 17.32v30z"
    />
    <path
      style={{
        fill: '#00ab36',
      }}
      d="M50 70.66 20 53.34v-7l30 17.32v7z"
    />
    <path
      style={{
        fill: '#8c6239',
      }}
      d="m50 81.66 30-17.32v-30L50 51.66v30z"
    />
    <path
      style={{
        fill: '#006f0e',
      }}
      d="m50 70.66 30-17.32v-7L50 63.66v7z"
    />
    <path
      style={{
        fill: '#b0865a',
      }}
      d="M80 34.34 50 51.66 20 34.34l30-17.32 30 17.32z"
    />
    <path
      style={{
        fill: '#81ccdf',
      }}
      d="M66.76 26.7 36.77 44.02l-3.53-2.04 29.99-17.32 3.53 2.04z"
    />
  </svg>
);

const Icon4 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <circle
      cx={50}
      cy={50}
      r={50}
      style={{
        fill: '#22398e',
      }}
    />
    <path
      style={{
        fill: '#a67c52',
      }}
      d="M50 81.66 20 64.34v-30l30 17.32v30z"
    />
    <path
      style={{
        fill: '#ab0036',
      }}
      d="M50 70.66 20 53.34v-7l30 17.32v7z"
    />
    <path
      style={{
        fill: '#8c6239',
      }}
      d="m50 81.66 30-17.32v-30L50 51.66v30z"
    />
    <path
      style={{
        fill: '#6f000e',
      }}
      d="m50 70.66 30-17.32v-7L50 63.66v7z"
    />
    <path
      style={{
        fill: '#b0865a',
      }}
      d="M80 34.34 50 51.66 20 34.34l30-17.32 30 17.32z"
    />
    <path
      style={{
        fill: '#81ccdf',
      }}
      d="M66.76 26.7 36.77 44.02l-3.53-2.04 29.99-17.32 3.53 2.04z"
    />
  </svg>
);

const Icon5 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <defs>
      <style>{'.Recurso_10_svg__h{fill:#cbc852}'}</style>
    </defs>
    <g id="Recurso_10_svg__b">
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#54398e',
        }}
        id="Recurso_10_svg__c"
      />
      <g id="Recurso_10_svg__d">
        <path
          d="M29.58 4.36a50.232 50.232 0 0 0-7.57 4.2L48.82 55h10L29.58 4.36Z"
          style={{
            fill: '#00830e',
          }}
        />
        <path
          d="M69.75 4.06 39.18 57h10L77.37 8.17a49.98 49.98 0 0 0-7.63-4.11Z"
          style={{
            fill: '#00ab36',
          }}
        />
        <circle
          cx={50}
          cy={60}
          r={14}
          style={{
            fill: '#e9e666',
          }}
        />
        <path
          className="Recurso_10_svg__h"
          d="M50 47c7.17 0 13 5.83 13 13s-5.83 13-13 13-13-5.83-13-13 5.83-13 13-13m0-2c-8.28 0-15 6.72-15 15s6.72 15 15 15 15-6.72 15-15-6.72-15-15-15Z"
        />
        <path
          className="Recurso_10_svg__h"
          d="M45.73 59.03c2.2-1.18 4.04-2.94 5.32-5.09l-2.1-.57c-.08 4.33-1.2 8.66.61 12.8.24.56 1.06.68 1.54.4.57-.34.65-.98.4-1.54-1.59-3.64-.38-7.87-.31-11.67.02-1.13-1.53-1.51-2.1-.57a11.527 11.527 0 0 1-4.51 4.28c-1.28.68-.14 2.62 1.14 1.94Z"
        />
      </g>
    </g>
  </svg>
);

const Icon6 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <defs>
      <style>
        {
          '.Recurso_11_svg__e{fill:#00ab36}.Recurso_11_svg__j,.Recurso_11_svg__k{stroke:#00830e;fill:none;stroke-miterlimit:10;stroke-width:.2px}.Recurso_11_svg__k{stroke:#005b00}'
        }
      </style>
    </defs>
    <g id="Recurso_11_svg__b">
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#c479b1',
        }}
        id="Recurso_11_svg__c"
      />
      <g id="Recurso_11_svg__d">
        <path
          style={{
            fill: '#00d35e',
          }}
          d="M64.07 44.16H15.32l21.11-12.19h48.75L64.07 44.16z"
        />
        <path className="Recurso_11_svg__e" d="M15.25 44.16h48.76v24.38H15.25z" />
        <ellipse
          className="Recurso_11_svg__e"
          cx={50.6}
          cy={38.06}
          rx={16.84}
          ry={3.24}
          transform="rotate(-1.42 50.776 38.158)"
        />
        <path
          style={{
            fill: '#00830e',
          }}
          d="M85.25 56.31 64.01 68.57V44.19l21.24-12.26v24.38z"
        />
        <path
          className="Recurso_11_svg__k"
          d="m63.99 50.81 21.24-12.26M63.99 51.51l21.24-12.27M63.99 52.2l21.24-12.26M63.99 52.9l21.24-12.27M63.99 53.6l21.24-12.27M63.99 54.29l21.24-12.26M63.99 50.11l21.24-12.26M63.99 49.42l21.24-12.27M63.99 48.72l21.24-12.26M63.99 48.02l21.24-12.26M63.99 47.33l21.24-12.27M63.99 46.63l21.24-12.26M63.99 45.93l21.24-12.26M63.99 45.24l21.24-12.27M63.99 60.56 85.23 48.3M63.99 61.26l21.24-12.27M63.99 61.95l21.24-12.26M63.99 62.65l21.24-12.26M63.99 63.35l21.24-12.27M63.99 64.04l21.24-12.26M63.99 59.87 85.23 47.6M63.99 65.44l21.24-12.27M63.99 66.13l21.24-12.26M63.99 66.83l21.24-12.26M63.99 67.53l21.24-12.27M63.99 68.22l21.24-12.26M63.99 64.74l21.24-12.26M63.99 59.17 85.23 46.9M63.99 58.47l21.24-12.26M63.99 57.78l21.24-12.27M63.99 57.08l21.24-12.27M63.99 56.38l21.24-12.26M63.99 55.69l21.24-12.27M63.99 54.99l21.24-12.27"
        />
        <path
          className="Recurso_11_svg__j"
          d="M15.25 50.77h48.76M15.25 51.47h48.76M15.25 52.17h48.76M15.25 52.86h48.76M15.25 53.56h48.76M15.25 54.25h48.76M15.25 50.08h48.76M15.25 49.38h48.76M15.25 48.68h48.76M15.25 47.99h48.76M15.25 47.29h48.76M15.25 46.59h48.76M15.25 45.9h48.76M15.25 45.2h48.76M15.25 60.52h48.76M15.25 61.22h48.76M15.25 61.92h48.76M15.25 62.61h48.76M15.25 63.31h48.76M15.25 64.01h48.76M15.25 59.83h48.76M15.25 65.4h48.76M15.25 66.1h48.76M15.25 66.79h48.76M15.25 67.49h48.76M15.25 68.19h48.76M15.25 64.7h48.76M15.25 59.13h48.76M15.25 58.43h48.76M15.25 57.74h48.76M15.25 57.04h48.76M15.25 56.34h48.76M15.25 55.65h48.76M15.25 54.95h48.76"
        />
        <path
          style={{
            fill: '#b0865a',
          }}
          d="M34.4 44.16h10.45v24.38H34.4z"
        />
        <path
          style={{
            fill: '#d8ae82',
          }}
          d="M44.74 44.16H34.3l21.11-12.19h10.45L44.74 44.16z"
        />
      </g>
    </g>
  </svg>
);

const Icon7 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <defs>
      <style>{'.Recurso_14_svg__f{fill:#00ab36}'}</style>
    </defs>
    <g id="Recurso_14_svg__b">
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#374d9c',
        }}
        id="Recurso_14_svg__c"
      />
      <g id="Recurso_14_svg__d">
        <path
          style={{
            fill: '#dde900',
          }}
          d="m55.4 22.89.1.12-36 30.2 19.78 23.57 36-30.21-.1-.11 4.32-23.71-24.1.14z"
        />
        <path
          className="Recurso_14_svg__f"
          d="m44.26 51.13-5.21 4.37-4.37-5.21-.95.8 4.37 5.21-5.21 4.37.8.95 5.21-4.38 4.37 5.22.95-.8-4.38-5.21 5.21-4.37-.79-.95zM59.3 28.5l-.94.79-2.14 24.39.95-.79L59.3 28.5z"
        />
        <circle className="Recurso_14_svg__f" cx={49.3} cy={42.54} r={2.78} />
        <circle className="Recurso_14_svg__f" cx={66.23} cy={39.64} r={2.78} />
      </g>
    </g>
  </svg>
);

const Icon8 = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <defs>
      <style>{'.Recurso_15_svg__g{fill:#00ab36}'}</style>
    </defs>
    <g id="Recurso_15_svg__b">
      <circle
        cx={50}
        cy={50}
        r={50}
        style={{
          fill: '#7890c9',
        }}
        id="Recurso_15_svg__c"
      />
      <g id="Recurso_15_svg__d">
        <path
          d="M47.5 99.95c.83.04 1.66.05 2.5.05s1.67-.02 2.5-.05V26h-5v73.95Z"
          style={{
            fill: '#ebebeb',
          }}
        />
        <rect
          x={15}
          y={33}
          width={70}
          height={23}
          rx={2.56}
          ry={2.56}
          style={{
            fill: '#d7d7d7',
          }}
        />
        <path
          className="Recurso_15_svg__g"
          d="M31.11 39.82c-.11-.11-.32-.26-.61-.44-.3-.18-.66-.37-1.08-.56-.42-.19-.88-.35-1.38-.48-.5-.13-1-.19-1.51-.19-.9 0-1.57.16-2.03.49s-.68.8-.68 1.42c0 .46.14.83.43 1.1.29.27.72.5 1.3.69.58.19 1.3.4 2.16.62 1.12.27 2.09.6 2.92.99.82.39 1.46.9 1.9 1.53.44.63.66 1.47.66 2.52 0 .89-.17 1.66-.5 2.29s-.8 1.16-1.38 1.56c-.58.41-1.26.7-2.02.88-.76.18-1.56.27-2.41.27s-1.7-.09-2.54-.26-1.66-.43-2.44-.76-1.5-.72-2.17-1.19l1.46-2.86c.14.14.4.33.77.56s.82.46 1.34.7c.53.23 1.1.43 1.73.59.62.16 1.26.24 1.9.24.91 0 1.59-.15 2.04-.44.45-.29.67-.72.67-1.29 0-.51-.18-.91-.54-1.21-.36-.29-.87-.55-1.52-.76s-1.43-.44-2.33-.68c-1.09-.3-1.99-.65-2.7-1.03-.71-.38-1.25-.86-1.61-1.42-.36-.57-.54-1.28-.54-2.14 0-1.16.28-2.14.84-2.93.56-.79 1.31-1.39 2.26-1.79.94-.41 1.99-.61 3.14-.61.8 0 1.56.09 2.27.26.71.18 1.38.41 2 .7.62.29 1.18.6 1.68.94l-1.46 2.69ZM39.92 35.36h3.36l6.26 17.04h-3.41l-1.42-4.25h-6.26l-1.42 4.25h-3.41l6.29-17.04Zm4.02 10.46-2.34-7.03-2.36 7.03h4.7ZM51.42 52.4V35.36h3.31V49.5h8.69v2.9h-12ZM77.27 49.5v2.9H65.44V35.36h11.62v2.9h-8.3v4.1h7.15v2.69h-7.15v4.44h8.52Z"
        />
      </g>
    </g>
  </svg>
);

export default IdIcons;
