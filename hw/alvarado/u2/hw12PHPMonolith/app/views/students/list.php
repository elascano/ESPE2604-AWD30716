<h2>Student Grades</h2>

<p>
    Total Students: <strong><?= (int) $totalStudents ?></strong>
    &nbsp;&nbsp;|&nbsp;&nbsp;
    Course Average: <strong><?= number_format($courseAverage, 2) ?> / 10</strong>
</p>

<?php if (empty($students)): ?>

    <p>
        No students enrolled yet.
        <a href="index.php?action=create" class="btn btn-primary">
            + Add the first student
        </a>
    </p>

<?php else: ?>

<table>
    <thead>
        <tr>
            <th>#</th>
            <th>Name</th>
            <th>ID Number</th>
            <th>Email</th>
            <th>Favorite Sport</th>
            <th>Favorite Subject</th>
            <th>Birth Date</th>
            <th>Grade 1</th>
            <th>Grade 2</th>
            <th>Grade 3</th>
            <th>Average</th>
            <th>Actions</th>
        </tr>
    </thead>

    <tbody>

        <?php foreach ($students as $index => $student): ?>

        <tr>

            <td><?= $index + 1 ?></td>

            <td><?= htmlspecialchars($student['name']) ?></td>

            <td><?= htmlspecialchars($student['id_number']) ?></td>

            <td><?= htmlspecialchars($student['email']) ?></td>

            <td><?= htmlspecialchars($student['favorite_sport']) ?></td>

            <td><?= htmlspecialchars($student['favorite_subject']) ?></td>

            <td><?= htmlspecialchars($student['birth_date']) ?></td>

            <td><?= number_format((float) $student['grade1'], 2) ?></td>

            <td><?= number_format((float) $student['grade2'], 2) ?></td>

            <td><?= number_format((float) $student['grade3'], 2) ?></td>

            <td>
                <strong>
                    <?= number_format((float) $student['average'], 2) ?>
                </strong>
            </td>

            <!-- ACTIONS -->
            <td class="actions">

                <!-- EDIT BUTTON -->
                <a href="index.php?action=edit&id=<?= (int) $student['id'] ?>"
                   class="btn btn-edit">
                    ✏ Edit
                </a>

                <!-- DELETE BUTTON -->
                <form method="POST"
                      action="index.php?action=delete&id=<?= (int) $student['id'] ?>"
                      onsubmit="return confirm('Delete <?= htmlspecialchars(addslashes($student['name'])) ?>?');">

                    <button type="submit"
                            class="btn btn-delete">
                        🗑 Delete
                    </button>

                </form>

            </td>

        </tr>

        <?php endforeach; ?>

    </tbody>

</table>

<?php endif; ?>
