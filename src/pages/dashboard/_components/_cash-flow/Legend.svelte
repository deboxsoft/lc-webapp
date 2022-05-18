<script>
  import { getContextChart } from "__@stores/chart";

  const { zGet, data } = getContextChart();
  const _width = 100;
  const _height = 15;
  const radius = 3;
</script>

<g>
  {#each $data as group, i}
    {@const color = $zGet(group)}
    {@const _x = i * 100}
    <g transform="translate(0,{_height * i})">
      <rect x="0" y="0" width={_width} height={_height} stroke="none" stroke-width="0" fill-opacity="0" fill="#fff" />
      <path d="M0,4.5L24,4.5" stroke={color} stroke-width="2" fill-opacity="1" fill="none" />
      <circle
        cx="12"
        cy="4.5"
        r="3"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke={color}
        fill="#fff"
      />
      <g>
        <text x="27" y="9" text-anchor="start" font-size="12" stroke="none" stroke-width="0" fill="#333">
          {group.label}
        </text>
      </g>
    </g>
  {/each}
</g>
