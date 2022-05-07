<script>
  let value;
  function changeValue(to, { duration = 500, from = value } = {}) {
    const range = to - from;
    const minTimer = 50;
    const step = Math.abs(Math.floor(duration / range));
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    const run = () => {
      const now = new Date().getTime();
      const remaining = Math.max((endTime - now) / duration, 0);
      value = Math.round(end - remaining * range);
      if (value === to) {
      }
    };
  }
</script>
