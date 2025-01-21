$(document).ready(function () {

	//$('#jenis_seragam_id').load('<?php echo base_url('seragam/getOptionJenisSeragam'); ?>');

	//loadTabel('jenis_seragam');
	//loadTabel('stok_seragam');
	$('.loadSelect').each(function () {
		let target = $(this).data('target');
		let url = baseClass + '/getOption_' + target;
		$(this).load(url);
	})
	$('.table').each(function () {
		let target = $(this).data('target');
		loadTabel(target);
	});

});

$('.addBtn').on('click', function () {
	let target = $(this).data('target');
	let form = '#form_' + target;
	$(form + ' input[type = "hidden"]').val('');
	$(form)[0].reset();

	$('#modal_' + target).modal('show');
});

$('.saveBtn').on('click', function () {
	let target = $(this).data('target'); // ambil target yang akan dituju (sebagai acuan)
	let url = baseClass + '/save_' + target; // buat url sesuai dengan target / acuan
	let formData = new FormData($('#form_' + target)[0]); // ambil semua value yang ada di form yang namanya sesuai dengan form target
	$.ajax({
		url: url,
		type: 'POST',
		data: formData,
		processData: false,
		contentType: false,
		dataType: 'json',
		success: function (response) {
			if (response.status) {
				alert(response.message);
				$('#modal_' + target).modal('hide');
				loadTabel(target);
			} else {
				alert(response.message);
			}
		}
	});
});


function loadTabel(target) {
	let table = $('#table_' + target);
	let url = baseClass + '/table_' + target;
	let tr = '';
	let th = '';
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json',
		success: function (response) {
			if (response.status) {
				generateTable(response.data, target);
			} else {
				tr = $('<tr>');
				table.find('tbody').html('');
				th = table.find('thead th').length;
				tr.append('<td colspan="' + th + '"> <h4>' + response.message + '</h4></td>');
			}
		}
	});
}

function generateTable(data, target) {
	const $table = $(`#table_${target}`);
	const $thead = $table.find('thead th');
	const $tbody = $table.find('tbody');

	let rows = "";

	data.forEach((item, index) => {
		let row = "<tr>";

		$thead.each(function () {
			const key = $(this).data('key');

			if (key === "no") {
				// Kolom nomor urut
				row += `<td style="${$(this).attr('style')}">${index + 1}</td>`;
			} else if (key === "btn_aksi") {
				// Kolom aksi
				row += `
					<td style="${$(this).attr('style')}">
						<button class="btn btn-primary btn-sm editBtn" data-value="${item.id}" data-target="${target}" >Edit</button>
						<button class="btn btn-danger btn-sm deleteBtn" data-value="${item.id}" data-target="${target}" >Delete</button>
					</td>`;
			} else {
				// Kolom lainnya berdasarkan key
				row += `<td style="${$(this).attr('style')}">${item[key] || '-'}</td>`;
			}
		});

		row += "</tr>";
		rows += row;
	});

	$tbody.html(rows);
}

$(document).on('click', '.editBtn', function () {
	let target = $(this).data('target');
	let id = $(this).data('value');
	console.log(target);
	let url = baseClass + '/edit_' + target + '/' + id;
	let form = '#form_' + target;
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json',
		success: function (response) {
			if (response.status) {
				$.each(response.data, function (i, item) {
					$(form + ' [name="' + i + '"]').val(item);
				});


				$('#modal_' + target).modal('show');
			} else {
				alert(response.message);
			}
		}
	});
});

$(document).on('click', '.deleteBtn', function () {
	let target = $(this).data('target');
	let id = $(this).data('value');
	let url = baseClass + '/delete_' + target + '/' + id;
	let form = '#form_' + target;
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json',
		success: function (response) {
			if (response.status) {
				alert(response.message);
				loadTabel(target);
			} else {
				alert(response.message);
			}
		}
	});

    
})