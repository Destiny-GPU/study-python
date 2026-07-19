/**
 * Builds Python source for the wind disturbance simulation.
 * Each enabled wind type contributes a named component with a direction.
 * The script decomposes all components into u/v and computes combined speed.
 */
export function buildWindCode(enabled, params, duration) {
  const p = (id) => params[id];
  return `
import random, math

dt = 0.02
n = int(${duration} / dt)
t = [i * dt for i in range(n)]

components = {}
dirs = {}

${enabled.steady ? `components['steady'] = [${p('speed')} * (1 + ${p('variability')}/100 * math.sin(2*math.pi*0.005*ti)) for ti in t]
dirs['steady'] = ${p('dir')}` : ''}

${enabled.shear ? `shear_mag = ${p('shear_mag')}
shear_h = ${p('shear_h')}
alpha = 0.2
components['shear'] = [shear_mag * (max(1, 10 + 5*math.sin(2*math.pi*0.02*ti)) / shear_h)**alpha for ti in t]
dirs['shear'] = ${p('shear_dir')}` : ''}

${enabled.periodic ? `A = ${p('period_amp')}
f = ${p('period_freq')}
components['periodic'] = [A * math.sin(2 * math.pi * f * ti) for ti in t]
dirs['periodic'] = ${p('period_dir')}` : ''}

${enabled.gust ? `peak = ${p('gust_peak')}
dur = ${p('gust_dur')}
onset = ${p('gust_onset')}
sigma = dur / 4
components['gust'] = [peak * math.exp(-0.5 * ((ti - onset) / sigma)**2) if abs(ti - onset) < dur else 0 for ti in t]
dirs['gust'] = ${p('gust_dir')}` : ''}

${enabled.turbulence ? `turb_i = ${p('turb_i')}
turb_scale = ${p('turb_scale')}
base_speed = ${enabled.steady ? p('speed') : 5}
if base_speed < 0.1:
    base_speed = 0.1
turb_sigma = turb_i * base_speed
random.seed(42)
white = [random.gauss(0, turb_sigma) for _ in range(n)]
window_size = max(1, int(turb_scale / (base_speed * dt)))
filtered = []
for i in range(n):
    start = max(0, i - window_size // 2)
    end = min(n, i + window_size // 2 + 1)
    filtered.append(sum(white[start:end]) / (end - start))
components['turbulence'] = filtered
dirs['turbulence'] = ${p('turb_dir')}` : ''}

# Vector decomposition (meteorological: 0=N, 90=E)
total_u = [0.0] * n
total_v = [0.0] * n

for key in components:
    d_rad = math.radians(dirs[key])
    sin_d, cos_d = math.sin(d_rad), math.cos(d_rad)
    for i in range(n):
        total_u[i] += components[key][i] * sin_d
        total_v[i] += components[key][i] * cos_d

total_speed = [math.sqrt(total_u[i]**2 + total_v[i]**2) for i in range(n)]

_chart_x = t
_chart_speed = total_speed
_chart_u = total_u
_chart_v = total_v

mean_v = sum(total_speed) / len(total_speed)
print(f"平均风速: {mean_v:.2f}")
print(f"最大风速: {max(total_speed):.2f}")
print(f"最小风速: {min(total_speed):.2f}")
print(f"风速标准差: {(sum((x - mean_v)**2 for x in total_speed) / len(total_speed))**0.5:.2f}")
`;
}
